import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Liked_Product } from "./entities/liked_product.entity";

@Injectable()
export class UserService {
    constructor(
    ) {}

}