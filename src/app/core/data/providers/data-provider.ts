// Aqui vai a interface para o provedor de dados, que define os métodos para operações CRUD no banco de dados

import { Entity } from "../models/entity";
import { QueryFilter } from "../filters/query-filter";

export interface DataProvider<T extends Entity> {

    create(data: Omit<T, 'id'>): Promise<string>;

    update(id: string, partial: Partial<Omit<T, 'id'>>): Promise<void>;

    delete(id: string): Promise<void>;

    findById(id: string): Promise<T | null>;

    findAll(): Promise<T[]>;

    find(filters: QueryFilter[]): Promise<T[]>;

    exists(id: string): Promise<boolean>;
}

