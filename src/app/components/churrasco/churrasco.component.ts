import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { ChurrascoService } from 'src/app/shared/services/churrasco.service';
import { Comidas } from 'src/app/shared/interfaces/comidas.interface';
import { Bebidas } from 'src/app/shared/interfaces/bebidas.interface';
import {tap}from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-churrasco',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './churrasco.component.html',
  styleUrls: ['./churrasco.component.scss'],
})
export class ChurrascoComponent implements OnInit, AfterViewInit, OnDestroy {
  proteinas: Comidas[] = [];
  bebidas: Bebidas[] = [];

  formPessoas: FormGroup;
  formProteinas: FormGroup = this.fb.group({});
  formBebidas: FormGroup = this.fb.group({});

  exibirLoading = false;
  exibirResultados = false;

  adultos_total = 0;
  criancas_total = 0;

  valor_total_carnes = 0;
  valor_total_bebidas = 0;
  valor_total = 0;

  consumoEstimadoCarnes: { [key: string]: number } = {};
  valorTotalCarnes: { [key: string]: number } = {};

  consumoEstimadoBebidas: { [key: string]: number } = {};
  valorTotalBebidas: { [key: string]: number } = {};

  dataHoraCalculo?: Date;

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private fb: FormBuilder,
    private churrascoService: ChurrascoService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.formPessoas = this.fb.group({
      adultos: [1, [Validators.required, Validators.min(1)]],
      criancas: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.churrascoService.getProteinas().pipe(
      tap((proteinas) => {
        this.proteinas = proteinas;
        const group: any = {};
        proteinas.forEach(p => group[p.nome] = [false]);
        this.formProteinas = this.fb.group(
          group,
          { validators: this.peloMenosUmSelecionado() }
        );
      })
    ).subscribe();

    this.churrascoService.getBebidas().pipe(
      tap((bebidas) => {
        this.bebidas = bebidas;
        const group: any = {};
        bebidas.forEach(b => group[b.nome] = [false]);
        this.formBebidas = this.fb.group(
          group,
          { validators: this.peloMenosUmSelecionado() }
        );
      })
    ).subscribe();
  }

  ngAfterViewInit(): void {
    // Reseta o stepper ao entrar na página
    if (this.stepper) {
      this.stepper.reset();
      this.stepper.selectedIndex = 0;
    }
  }

  ngOnDestroy(): void {
    // Reseta o stepper ao sair da página
    if (this.stepper) {
      this.stepper.reset();
      this.stepper.selectedIndex = 0;
    }
  }

  calcularChurrasco(): void {
    this.zerarValores();

    if (this.formPessoas.valid && this.formProteinas.valid && this.formBebidas.valid) {
      this.exibirLoading = true;

      const { adultos, criancas } = this.formPessoas.value;
      this.adultos_total = adultos;
      this.criancas_total = criancas;

      // Carnes
      this.proteinas.forEach(p => {
        if (this.formProteinas.value[p.nome]) {
          const consumo = adultos * p.consumo_medio_adulto_g + criancas * p.consumo_medio_crianca_g;
          const consumoKg = consumo / 1000;
          const valorTotal = consumoKg * p.preco_kg;

          this.consumoEstimadoCarnes[p.nome] = consumoKg;
          this.valorTotalCarnes[p.nome] = valorTotal;
        }
      });

      // Bebidas
      this.bebidas.forEach(b => {
        if (this.formBebidas.value[b.nome]) {
          const consumo = adultos * b.consumo_medio_adulto_ml + criancas * b.consumo_medio_crianca_ml;
          const consumoL = consumo / 1000;
          const valorTotal = consumoL * b.preco_unidade;

          this.consumoEstimadoBebidas[b.nome] = consumoL;
          this.valorTotalBebidas[b.nome] = valorTotal;
        }
      });

      this.valor_total_carnes = Object.values(this.valorTotalCarnes).reduce((a, b) => a + b, 0);
      this.valor_total_bebidas = Object.values(this.valorTotalBebidas).reduce((a, b) => a + b, 0);
      this.valor_total = this.valor_total_carnes + this.valor_total_bebidas;

      this.dataHoraCalculo = new Date();
      this.exibirResultados = true;
      this.exibirLoading = false;
    }
  }

  zerarValores(): void {
    this.adultos_total = 0;
    this.criancas_total = 0;
    this.valor_total_carnes = 0;
    this.valor_total_bebidas = 0;
    this.valor_total = 0;

    this.consumoEstimadoCarnes = {};
    this.valorTotalCarnes = {};
    this.consumoEstimadoBebidas = {};
    this.valorTotalBebidas = {};

    this.exibirResultados = false;
    this.dataHoraCalculo = undefined;
  }

  reiniciar(): void {
    this.zerarValores();
    if (this.stepper) {
      this.stepper.reset();         // Reseta o stepper (limpa validações e volta ao início)
      this.stepper.selectedIndex = 0; // Garante que está no primeiro passo
    }
  }

  salvarResultado(): void {
    if (this.valor_total && this.dataHoraCalculo) {
      const novoResultado = {
        valor: this.valor_total,
        dataHora: this.dataHoraCalculo.toISOString()
      };
      const lista = JSON.parse(localStorage.getItem('churrascos') || '[]');
      lista.push(novoResultado);
      localStorage.setItem('churrascos', JSON.stringify(lista));
      this.snackBar.open('Resultado salvo com sucesso!', 'Fechar', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }

  irParaCalculos(): void {
    this.router.navigate(['/calculos']);
  }

  // Validador customizado para pelo menos uma opção marcada
  private peloMenosUmSelecionado(): ValidatorFn {
    return (control: AbstractControl) => {
      const valores = Object.values(control.value);
      return valores.some(v => v) ? null : { peloMenosUm: true };
    };
  }
}
