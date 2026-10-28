import { Entity } from "@core/data/models/entity";

export interface User extends Entity {
    email: string;
}