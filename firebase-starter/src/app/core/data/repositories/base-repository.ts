// Aqui vai a implementação do repositório base, que fornece métodos genéricos para operações CRUD em entidades que estendem a interface Entity. Ele utiliza um provedor de dados (DataProvider) para interagir com o banco de dados.

import { Firestore } from 'firebase/firestore';

import { Entity } from '../models/entity';
import { FirestoreDataProvider } from '../providers/firestore-data-provider';
import { QueryFilter } from '../filters/query-filter';
import { DataProvider } from '../providers/data-provider';

export abstract class BaseRepository<T extends Entity> {
    
    // private readonly provider: DataProvider<T>;

    // protected constructor(
    //     firestore: Firestore,
    //     collection: string
    // ) {
    //     this.provider = new FirestoreDataProvider<T>(
    //         firestore,
    //         collection
    //     )
    // }

    protected constructor(
        private readonly provider: DataProvider<T>
    ) {}

    public create(data: Omit<T, 'id'>): Promise<string> {
        return this.provider.create(data);
    }

    public update(id: string, data: Partial<Omit<T, 'id'>>): Promise<void> {
        return this.provider.update(id, data);
    }

    public delete(id: string): Promise<void> {
        return this.provider.delete(id);
    }

    public findById(id: string): Promise<T | null> {
        return this.provider.findById(id);
    }

    public findAll(): Promise<T[]> {
        return this.provider.findAll();
    }

    public exists(id: string): Promise<boolean> {
        return this.provider.exists(id);
    }

    public find(filters: QueryFilter[]): Promise<T[]> {
        return this.provider.find(filters);
    }
}