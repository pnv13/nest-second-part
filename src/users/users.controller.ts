import { CreateUserDto } from './dto/create-user.dto'
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query
} from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from './entities/user.entity'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOkResponse({ type: User, isArray: true })
  @ApiQuery({ name: 'name', required: false })
  @Get()
  getUsers(@Query('name') name?: string): User[] {
    return this.userService.findAll(name)
  }

  @ApiOkResponse({ type: User })
  @ApiNotFoundResponse({
    description: 'A user with the specified ID was not found.'
  })
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): User {
    const user = this.userService.findById(id)

    if (!user) {
      throw new NotFoundException()
    }

    return user
  }

  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse({ description: 'Invalid body parameters' })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto): User {
    return this.userService.createUser(createUserDto)
  }
}
