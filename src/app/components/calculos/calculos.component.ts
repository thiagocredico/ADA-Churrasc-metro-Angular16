import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-calculos',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './calculos.component.html',
  styleUrls: ['./calculos.component.scss']
})
export class CalculosComponent implements OnInit {
  churrascos: { valor: number, dataHora: string }[] = [];

  constructor(private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const lista = localStorage.getItem('churrascos');
    this.churrascos = lista ? JSON.parse(lista) : [];
  }

  voltarHome(): void {
    this.router.navigate(['/home']);
  }

  voltarChurrasco(): void {
    this.router.navigate(['/churrasco']);
  }

  limparHistorico(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '320px',
      data: { mensagem: 'Deseja apagar o histórico?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        localStorage.removeItem('churrascos');
        this.churrascos = [];
        this.snackBar.open('Histórico apagado!', 'Fechar', { duration: 3000, verticalPosition: 'top' });
      } else {
        this.snackBar.open('Ação cancelada, histórico mantido.', 'Fechar', { duration: 3000, verticalPosition: 'top' });
      }
    });
  }
}


