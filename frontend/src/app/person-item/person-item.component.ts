import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-person-item',
  templateUrl: './person-item.component.html',
  styleUrls: ['./person-item.component.css'],
})
export class PersonItemComponent {
  @Input() person: any; // Adicione esta propriedade de entrada para receber os dados da pessoa
  @Input() verMais: any;
  @Input() editar: any;
  @Input() excluir: any;

  // Restante do código do componente
}
