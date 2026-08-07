import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserRepository } from '@features/users/repositories/user.repository';

@Component({
  selector: 'app-firestore-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
],
  templateUrl: './firestore-test.html',
  styleUrl: './firestore-test.scss',
})
export class FirestoreTest {
  
  private readonly userRepository = inject(UserRepository);

  id: string = '';
  email: string = '';
  updatedEmail: string = '';

  result: unknown = null;

  async create(): Promise<void> {
    
    try {
      
      const id = await this.userRepository.create({
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

      this.result = await this.userRepository.findById(
        this.id
      );

    } catch (error) {
      this.result = error;
    }
   

  }

  async findAll(): Promise<void> {
    try {
      this.result = await this.userRepository.findAll();
    } catch (error) {
      this.result = error;
    }
    
  }

  async update(): Promise<void> {
    try {

      await this.userRepository.update(
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

      await this.userRepository.delete(
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
