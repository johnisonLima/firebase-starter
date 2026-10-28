import { Inject, Injectable } from "@angular/core";

import { Firestore } from "firebase/firestore";

import { BaseRepository } from "@core/data/repositories/base-repository";
import { Collections } from "@core/data/collections/collections";

import { User } from "../models/user";
import { FIRESTORE } from "@core/firebase/firebase.tokens";
import { FirestoreDataProvider } from "@core/data/providers/firestore-data-provider";


@Injectable({
    providedIn: 'root'
})

// export class UserRepository extends BaseRepository<User> {
//     constructor(
//         @Inject(FIRESTORE) firestore: Firestore
//     ) {
//         super(
//             firestore,
//             Collections.USERS
//         )
//     }
// }

export class UserRepository extends BaseRepository<User> {

    constructor(
        @Inject(FIRESTORE) firestore: Firestore
    ) {
        super(
            new FirestoreDataProvider<User>(
                firestore,
                Collections.USERS
            )
        );
    }

}