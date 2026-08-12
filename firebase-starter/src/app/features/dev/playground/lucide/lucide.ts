import { Component } from '@angular/core';
import { LucideHouse, LucideSettings, LucideUser, } from '@lucide/angular';

@Component({
  selector: 'app-lucide',
  imports: [LucideHouse, LucideUser, LucideSettings],
  templateUrl: './lucide.html',
  styleUrl: './lucide.scss',
})
export class Lucide {}
