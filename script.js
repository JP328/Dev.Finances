/*
const Modal = {
  open() {
    // Abrir Modal
    //Adicionar a class active ao Modal
    document.querySelector('.modal-overlay').classList.add('active')
  },
  
  close() {
    // Fechar Modal
    //Remover a class active ao Modal
    document.querySelector('.modal-overlay').classList.remove('active')
  }
}
*/
const ToggleModal = () => {
  document.querySelector('.modal-overlay').classList.toggle('active')
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
  },
  set(transactions) {
    localStorage.setItem(
      'dev.finances:transactions',
      JSON.stringify(transactions)
    )
  }
}

const Transaction = {
  all: Storage.get(),
  /*[
    {
      description: 'Luz',
      amount: -50000,
      date: `01/01/1000`
    },
    {
      description: 'Website',
      amount: 500000,
      date: `02/02/2000`
    },
    {
      description: 'Internet',
      amount: -20000,
      date: `05/07/2021`
    },
    {
      description: 'App',
      amount: 205050,
      date: `02/07/2020`
    },
    {
      description: 'Aluguel',
      amount: -125050,
      date: `22/07/2021`
    }
  ],
  */

  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    //somar as entradas
    let income = 0
    //pegar todas as transações, para cada transação...
    Transaction.all.forEach(transaction => {
      //...que for maior que zero
      if (transaction.amount > 0) {
        //somamos a uma variavel e a retornamos para a mesma
        income += transaction.amount
      }
    })

    return income
  },

  expenses() {
    //somar as saídas
    let expense = 0

    //pegar todas as transações, para cada transação...
    Transaction.all.forEach(transaction => {
      //...que for menor que zero
      if (transaction.amount < 0) {
        //somamos a uma variavel e a retornamos para a mesma
        expense += transaction.amount
      }
    })

    return expense
  },

  total() {
    return Transaction.incomes() + Transaction.expenses()
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação" />
      </td>
    `

    return html
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    )
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    )
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(
      Transaction.total()
    )
  },
  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ''
  }
}

const Utils = {
  formatAmount(value) {
    value = value * 100
    //expressão regular, não deu certo devido a bugs
    //value = Number(value.replace(/\,?\.?/g, "")) * 100

    return Math.round(value)
  },

  formatDate(date) {
    const splittedDate = date.split('-')

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  //Muito conteúdo em uma funçao só!
  formatCurrency(value) {
    //Transforma o value em números e aplica uma lógica de programação concisa de if-else eficaz e muito interresante
    const signal = Number(value) < 0 ? '- ' : ''

    //transforma o value em string e substitui todos os sinais de menos(-) adicionados pelo signal, utilizando expressão regular.
    value = String(value).replace(/\D/g, '')

    //Transforma o value em números e os divide por cem
    value = Number(value) / 100

    //Formata os dados do value para a moeda brasileira, utilizando uma funcionalidade nativa do JS
    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return signal + value
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  //validar os campos e averiguar se todos estão preenchidos
  validateField() {
    //desestruturação do objeto getValues
    const { description, amount, date } = Form.getValues()

    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      throw new Error('Por favor, preencha todos os campos')
    }
  },

  //formatar os dados
  formatValues() {
    let { description, amount, date } = Form.getValues()

    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  //limpa os dados do form para ele ser utilizado novamente
  clearFields(transaction) {
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },

  submit(event) {
    //evitar que o formulario faça seu comportamento padrão
    event.preventDefault()

    //Tratamento de erros
    try {
      Form.validateField()
      const transaction = Form.formatValues()
      //Salva e adiciona a nova transação na tabela
      Transaction.add(transaction)
      Form.clearFields()
      ToggleModal()
    } catch (error) {
      alert(error.message)
    }
  }
}

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction)

    DOM.updateBalance()

    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  }
}

App.init()
