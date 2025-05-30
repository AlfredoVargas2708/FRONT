import { Component} from '@angular/core';
import { LegoService } from '../services/lego.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  legoPieces: any[] = [];
  isTableVisible: boolean = false;

  constructor(private legoService: LegoService) { }

  searchLegoPiece(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior
    const inputElement = event.target as HTMLInputElement;
    const code = inputElement.value.trim(); // Get the value from the input element
    if (!code) {
      console.error('Search code input is empty');
      return;
    }
    this.legoService.getLegoPieceByCode(code).subscribe({
      next: (data) => {
        if (data) {
          console.log('Lego piece found:', data);
          this.legoPieces = Array.isArray(data) ? data : [data];
        } else {
          console.warn('No Lego piece found for code:', code);
          this.legoPieces = []; // Clear the list if not found
        }
      },
      error: (error) => {
        console.error('Error fetching Lego piece:', error);
        this.legoPieces = []; // Clear the list on error
      }
    })
  }

  viewTable() {
    this.isTableVisible = true;
  }

  editLegoPiece(id: number) {
    console.log('Edit Lego piece with ID:', id);
    // Implement the logic to edit the Lego piece
    // This could involve navigating to an edit page or opening a modal
  }
}
