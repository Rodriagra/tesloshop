import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}
  async create(createUserDto: CreateUserDto) {
    try {
      const {password, ...userDate} = createUserDto;
      const user = this.userRepository.create( {
        ...userDate,
        password:bcrypt.hashSync(password,10)
      } );
      await this.userRepository.save( user )
      delete user.password;
      return user;
    } catch (error) {
      this.HandleDBErrors(error)
    }
  }

  private HandleDBErrors(error: any): never{
    if(error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error)
    throw new InternalServerErrorException("Please check up server logs");

  }
}
