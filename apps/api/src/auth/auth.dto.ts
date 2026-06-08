import { IsEmail, IsString, Length } from "class-validator";

export class RegisterDto {
  @IsString()
  @Length(3, 64)
  username!: string;

  @IsEmail()
  @Length(3, 254)
  email!: string;

  @IsString()
  @Length(8, 128)
  password!: string;
}

export class LoginDto {
  @IsString()
  @Length(3, 254)
  login!: string;

  @IsString()
  @Length(8, 128)
  password!: string;
}
