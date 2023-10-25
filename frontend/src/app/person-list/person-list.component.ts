import { Component, OnInit, HostListener } from '@angular/core';
import { PersonService } from '../person.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css'],
  providers: [DatePipe],
})
export class PersonListComponent implements OnInit {
  mostrarFormularioEdicao: boolean = false;
  pessoaEditada: any = {}; // Dados da pessoa a ser editada

  editar(person: any) {
    // Copie os dados da pessoa a ser editada para a variável pessoaEditada
    this.pessoaEditada = { ...person };

    // Defina mostrarFormularioEdicao como true para mostrar o formulário de edição
    this.mostrarFormularioEdicao = true;
  }

  salvar() {
    if (Object.keys(this.pessoaEditada).length === 0) {
      // Nenhum ID na pessoaEditada, então é um novo registro
      this.adicionarRegistro();
    } else {
      // Tem um ID na pessoaEditada, então é uma edição
      this.salvarEdicao();
    }
  }

  cancelarEdicao() {
    // Limpe os dados da pessoaEditada e oculte o formulário de edição
    this.pessoaEditada = {};
    this.mostrarFormularioEdicao = false;
  }

  salvarEdicao() {
    // Formate a data de nascimento e admissão no formato 'AAAA-MM-DD'
    this.pessoaEditada.data_nascimento = this.formatarData(
      this.pessoaEditada.data_nascimento
    );
    this.pessoaEditada.data_admissao = this.formatarData(
      this.pessoaEditada.data_admissao
    );

    //lógica para enviar as edições da pessoa para o servidor
    this.personService
      .updatePerson(this.pessoaEditada.id_pessoa, this.pessoaEditada)
      .subscribe(
        (response) => {
          // Sucesso: As edições foram salvas com sucesso
          console.log('Edições da pessoa foram salvas com sucesso.');

          //Limpe a variável pessoaEditada
          this.pessoaEditada = {};

          // Oculte o formulário de edição
          this.mostrarFormularioEdicao = false;

          // Atualize a lista de pessoas após a edição ser concluída
          this.atualizarListaPessoas();
        },
        (error) => {
          // Erro: Não foi possível salvar as edições
          console.error('Erro ao salvar as edições da pessoa:', error);
          // Você pode exibir uma mensagem de erro ao usuário aqui
        }
      );
  }

  editarPessoa(pessoa: any) {
    //dados da pessoa a ser editada para a variável pessoaEditada
    this.pessoaEditada = { ...pessoa };

    //mostrarFormularioEdicao como true para mostrar o formulário de edição
    this.mostrarFormularioEdicao = true;

    this.pessoaEditada.data_nascimento = this.datePipe.transform(
      this.pessoaEditada.data_nascimento,
      'dd/MM/yyyy'
    );
    this.pessoaEditada.data_admissao = this.datePipe.transform(
      this.pessoaEditada.data_admissao,
      'dd/MM/yyyy'
    );

    // Rolar suavemente para o formulário de edição
    const elementoFormulario = document.getElementById('formulario-edicao');
    if (elementoFormulario) {
      elementoFormulario.scrollIntoView({
        behavior: 'instant',
        block: 'center',
      });
    }
  }

  pessoas: any[] = [];
  displayedColumns: string[] = [
    'id_pessoa',
    'rg',
    'cpf',
    'data_nascimento',
    'data_admissao',
    'funcao',
  ];
  colunasVisiveis: string[] = ['nome', 'data_nascimento', 'actions'];

  mostrarFormulario: boolean = false;
  novoRegistro: any = {
    nome: '',
    rg: '',
    cpf: '',
    data_nascimento: '',
    data_admissao: '',
    funcao: '',
  };

  mostrarDetalhes: boolean = false;
  detalhesPessoa: any;

  verMaisAtivo: boolean = false;

  constructor(
    private personService: PersonService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.personService.getAllPeople().subscribe((data: any[]) => {
      // Ordene os dados com base no nome em ordem alfabética
      data.sort((a, b) => a.nome.localeCompare(b.nome));
      this.pessoas = data;
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  formatarData(data: string): string {
    // Dividindo a data original 'DD/MM/AAAA' em partes
    const partesData = data.split('/');

    // Reorganizando as partes da data no formato 'AAAA-MM-DD'
    return `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
  }

  verMais(person: any, coluna: string) {
    this.detalhesPessoa = person;
    this.mostrarDetalhes = true;
    this.colunasVisiveis = [
      'nome',
      'data_nascimento',
      'rg',
      'cpf',
      'data_admissao',
      'funcao',
      'actions',
    ];

    this.verMaisAtivo = !this.verMaisAtivo;
  }

  alternarVerMaisMenos() {
    this.verMaisAtivo = !this.verMaisAtivo;

    if (this.verMaisAtivo) {
      this.colunasVisiveis = [
        'nome',
        'data_nascimento',
        'rg',
        'cpf',
        'funcao',
        'data_admissao',
        'actions',
      ];
    } else {
      this.colunasVisiveis = ['nome', 'data_nascimento', 'actions'];
    }
  }

  alternarMostrarFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  atualizarListaPessoas() {
    this.personService.getAllPeople().subscribe((data: any[]) => {
      this.pessoas = data;
    });
  }

  adicionarRegistro() {
    // Certificando-se de que os dados do novo registro estejam preenchidos corretamente
    if (
      this.novoRegistro.nome &&
      this.novoRegistro.rg &&
      this.novoRegistro.cpf &&
      this.novoRegistro.data_nascimento &&
      this.novoRegistro.data_admissao &&
      this.novoRegistro.funcao
    ) {
      // Envie o novo registro para o servidor usando o serviço PersonService
      this.personService.createPerson(this.novoRegistro).subscribe(
        (response: { id: any }) => {
          // Sucesso: O novo registro foi adicionado ao banco de dados
          console.log('Pessoa adicionada com sucesso. ID:', response.id);

          // Armazene o ID na propriedade do objeto novoRegistro
          this.novoRegistro.id = response.id;

          // Limpe o formulário e oculte-o
          this.novoRegistro = {
            nome: '',
            rg: '',
            cpf: '',
            data_nascimento: '',
            data_admissao: '',
            funcao: '',
          };
          this.mostrarFormulario = false;

          // Atualize a lista de pessoas para refletir o novo registro
          this.atualizarListaPessoas();
        },
        (error: any) => {
          // Erro: Não foi possível adicionar o novo registro
          console.error('Erro ao adicionar a pessoa:', error);
        }
      );
    } else {
      // Exiba uma mensagem de erro se algum campo estiver em branco
      console.error('Por favor, preencha todos os campos.');
    }
  }

  //editar(person: any, id: number) {
  // Redirecione para a página de edição com base no ID
  //this.router.navigate([`editar/${id}`]);
  //}

  excluir(id: number) {
    if (id) {
      this.personService.deletePerson(id).subscribe(() => {
        // Sucesso: A pessoa foi excluída
        console.log(`Pessoa com ID ${id} excluída com sucesso.`);

        // Atualize a lista de pessoas para refletir a exclusão
        this.atualizarListaPessoas();
      });
    } else {
      console.error('ID inválido. Não é possível excluir a pessoa.');
    }
  }

  cancelarCadastro() {
    // Limpe os campos do formulário
    this.novoRegistro = {
      nome: '',
      rg: '',
      cpf: '',
      data_nascimento: '',
      data_admissao: '',
      funcao: '',
    };

    // Oculte o formulário
    this.mostrarFormulario = false;
  }

  showBackToTopButton: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showBackToTopButton = window.scrollY > 70;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
