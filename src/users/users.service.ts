import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { comparePasswords } from '../shared/encryption.util';
import { userRegisterDto } from '../auth/dtos/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepositry: Repository<User>,
    private configService: ConfigService,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.userRepositry.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not Exist');
    }

    return user;
  }

  async findOnebyUsername(username: string): Promise<User> {
    const user = await this.userRepositry.findOne({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not Exist');
    }

    return user;
  }

  async update(id: number, user: User): Promise<User> {
    const updatedUser = await this.userRepositry.save({ ...user, id });

    return updatedUser;
  }

  /**
   * Checks if a user with the given email or name already exists.
   *
   * @param {string} email The email of the user.
   * @param {string} name The name of the user.
   *
   * @return {Promise<boolean>} True if the user exists, false otherwise.
   */
  async doesUserExist(username: string): Promise<boolean> {
    // Query the database for a user with the given email or name
    const existingUser: User = await this.userRepositry.findOne({
      where: [{ username }],
    });

    // Return true if a user is found, false otherwise
    return existingUser ? true : false;
  }

  /**
   * Creates a new user.
   *
   * @param {CreateUserDto} createUserDto The details of the user to create.
   *
   * @throws {BadRequestException} If the user already exists or is outside Egypt.
   * @return {Promise<User>} The newly created user.
   */
  async create(createUserDto: userRegisterDto): Promise<User> {
    // Destructure the name and email from the createUserDto
    const { username } = createUserDto;

    // Check if a user with the given email or name already exists
    const existingUser: boolean = await this.doesUserExist(username);

    // If the user already exists, throw an exception
    if (existingUser) {
      throw new BadRequestException('username already exists');
    }

    // Create a new user with the given details and the city
    const newUser: User = this.userRepositry.create(createUserDto);

    // Save the new user to the database
    const saved = await this.userRepositry.save(newUser);

    console.log('sssss', saved);

    // Remove the password from the returned user
    delete newUser.password;

    // Return the newly created user
    return newUser;
  }

  /**
   * Retrieves all users.
   *
   * @return {Promise<User[]>} An array of all users.
   */
  findAll(): Promise<User[]> {
    // Query the database to find all users
    return this.userRepositry.find({});
  }

  /**
   * Retrieves a user by ID.
   *
   * @param {number} id The ID of the user.
   *
   * @throws {NotFoundException} If the user is not found.
   * @return {Promise<User>} The user with the given ID.
   */
  async findOne(id: number): Promise<User> {
    // Query the database to find a user with the given ID
    const user: User = await this.userRepositry.findOne({ where: { id } });

    // If no user is found, throw an exception
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Return the found user
    return user;
  }

  /**
   * Validates a user's username and password.
   *
   * @param {string} email The email of the user.
   * @param {string} password The password of the user.
   *
   * @throws {UnauthorizedException} If the username or password is invalid.
   * @return {Promise<User>} The validated user.
   */
  async validateUser(username: string, password: string): Promise<User> {
    // Find the user by email, including the password
    const loginUser = await this.findOnebyUsername(username);

    // If no user is found, throw an exception
    if (!loginUser) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Compare the given password with the user's password
    const correctPassword = await comparePasswords(
      password,
      loginUser.password,
    );

    // If the password is incorrect, throw an exception
    if (!correctPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    delete loginUser.password;

    // Return the validated user
    return loginUser;
  }

  async validatePassword(
    password: string,
    hashedPassword: string,
    salt: string,
  ): Promise<boolean> {
    const hash = await bcrypt.hash(password, salt);
    return hash === hashedPassword;
  }

  async hashPassword(
    password: string,
  ): Promise<{ salt: string; hashedPassword: string }> {
    const salt = await bcrypt.genSalt(
      Number(this.configService.get('BCRYPT_SALT')),
    );
    const hashedPassword = await bcrypt.hash(password, salt);
    return { salt, hashedPassword };
  }
}
