import { IsNumberString, IsOptional, IsString } from "class-validator";

export class validateCreateUser {

    @IsString()
    username: string;

    @IsString()
    password: string;
}


