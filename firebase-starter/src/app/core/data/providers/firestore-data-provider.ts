// Aqui vai a implementação do provedor de dados para o Firestore, que implementa a interface DataProvider e fornece métodos para operações CRUD no banco de dados Firestore

import { 
    CollectionReference, DocumentData, DocumentReference ,Firestore, Timestamp, collection, doc, QueryDocumentSnapshot, addDoc, getDoc,
    getDocs, updateDoc, deleteDoc, where, query    
} from 'firebase/firestore';


import { Entity } from '../models/entity';
import { DataProvider } from './data-provider';
import { QueryFilter } from '../filters/query-filter';

export class FirestoreDataProvider<T extends Entity> implements DataProvider<T> {

    constructor(
        private readonly firestore: Firestore, 
        private readonly collection: string
    ) {}

    private get collectionRef(): CollectionReference<DocumentData> {
        return collection(
            this.firestore, 
            this.collection
        )
    }

    private documentRef(id: string): DocumentReference<DocumentData> {
        return doc(
            this.collectionRef,
            id.toString()
        )
    }

    // Helpers
    private mapEntity(snapshot: QueryDocumentSnapshot<DocumentData>): T {

        const data = snapshot.data();

        return {
            id: snapshot.id,
            ...this.mapObject(data)
        } as T;
    }

    private mapObject(object: Record<string, unknown>): Record<string, unknown> {
        return Object.fromEntries(
            Object.entries(object).map(([key, value]) => [
                key,
                this.mapValue(value),
            ])
        )
    }

    private mapValue(value: unknown): unknown {
        if (value instanceof Timestamp) {
            return value.toDate();
        }

        if (Array.isArray(value)) {
            return value.map(item => this.mapValue(item));
        }

        if (this.isPlainObject(value)) {
            return this.mapObject(
                value as Record<string, unknown>
            );
        }

        return value;
    }

    private isPlainObject(value: unknown): value is Record<string, unknown> {
        return (
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value) &&
            !(value instanceof Timestamp)
        )
    }

    // CRUD
    async create(data: Omit<T, 'id'>): Promise<string> {

        const promise = addDoc(
            this.collectionRef,
            data,
        );

        const document = await promise;

        return document.id;

    }
    
    async findById(id: string): Promise<T | null> {

        const snapshot = await getDoc(
            this.documentRef(id),
        )

        if (!snapshot.exists()) {
            return null;
        }

        return this.mapEntity(snapshot);
    }
    
    async exists(id: string): Promise<boolean> {
        
        const snapshot = await getDoc(
            this.documentRef(id),
        )

        return snapshot.exists();
    }

    async findAll(): Promise<T[]> {
        
        const snapshot = await getDocs(
            this.collectionRef,
        )

        return snapshot.docs.map(document => this.mapEntity(document));
    }

    async update(id: string, data: Partial<Omit<T, 'id'>>): Promise<void> {
        
        await updateDoc(
            this.documentRef(id),
            this.mapObject(
                data as Record<string, unknown>
            )
        )
    }

    async delete(id: string): Promise<void> {
        await deleteDoc(
            this.documentRef(id),
        )
    }

    async find(filters: QueryFilter[]): Promise<T[]> {

        if (filters.length === 0) {
            return this.findAll();
        }

        const constraints = filters.map(filter => 
            where(
                filter.field,
                filter.operator,
                filter.value
            )
        )

        const querySnapshot = await getDocs(
            query(
                this.collectionRef,
                ...constraints
            )
        )

        return querySnapshot.docs.map(document => 
            this.mapEntity(document)
        );
    }

}
