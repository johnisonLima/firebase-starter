import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Button } from '@shared/components/button/button';
import { Input } from '@shared/components/input/input';

import { PlaygroundUserRepository } from './playground-user.repository';

@Component({
  selector: 'app-firestore-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Button,
    Input,
  ],
  templateUrl: './firestore-test.html',
  styleUrl: './firestore-test.scss',
})
export class FirestoreTest {

  private readonly playgroundUserRepository = inject(PlaygroundUserRepository);

  id: string = '';
  email: string = '';
  updatedEmail: string = '';

  result: unknown = null;

  async create(): Promise<void> {
    try {
      const id = await this.playgroundUserRepository.create({
        email: this.email
      });

      this.id = id;

      this.result = `User created with ID: ${id}`;

    } catch (error) {
      this.result = error;
    }
  }

  async findById(): Promise<void> {
    try {
      this.result = await this.playgroundUserRepository.findById(
        this.id
      );

    } catch (error) {
      this.result = error;
    }
  }

  async findAll(): Promise<void> {
    try {
      this.result = await this.playgroundUserRepository.findAll();
    } catch (error) {
      this.result = error;
    }
  }

  async update(): Promise<void> {
    try {
      await this.playgroundUserRepository.update(
        this.id,
        {
          email: this.updatedEmail
        }
      );

      this.result = `User with ID: ${this.id} updated successfully.`;

    } catch (error) {
      this.result = error;
    }
  }

  async delete(): Promise<void> {
    try {
      await this.playgroundUserRepository.delete(
        this.id
      );

      this.result = `User with ID: ${this.id} deleted successfully.`;

    } catch (error) {
      this.result = error;
    }
  }

  onClear(): void {
    this.id = '';
    this.email = '';
    this.updatedEmail = '';
    this.result = null;
  }

}
