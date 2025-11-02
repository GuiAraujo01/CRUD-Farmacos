document.addEventListener('DOMContentLoaded', () => {

  // ========================
  // Seletores de Elementos 
  // ========================
  // Seletores originais do seu projeto.
  const body = document.body;
  const tableContainer = document.querySelector('.table-container');
  const tableBody = document.getElementById('table-body');
  const searchInput = document.getElementById('search-input');
  const mainTitle = document.getElementById('main-title');
  const themeToggle = document.getElementById('theme-toggle');
  const infoPopover = document.getElementById('info-popover');
  const paginationControls = document.getElementById('pagination-controls');
  
  const formModal = document.getElementById('form-modal');
  const resultModal = document.getElementById('result-modal');
  const filterModal = document.getElementById('filter-modal');
  const chunkModal = document.getElementById('chunk-modal');
  const imageViewerModal = document.getElementById('image-viewer-modal');
  const priceAnalysisModal = document.getElementById('price-analysis-modal');
  const farmacoForm = document.getElementById('farmaco-form');
  const filterForm = document.getElementById('filter-form');
  const chunkForm = document.getElementById('chunk-form');

  const statTotalItems = document.getElementById('stat-total-items');
  const statTotalUnits = document.getElementById('stat-total-units');
  const statTotalValue = document.getElementById('stat-total-value');
  
  // --- ADIÇÃO: NOVOS SELETORES PARA O MODAL DE ADIÇÃO PELA API ---
  const apiAddModal = document.getElementById('api-add-modal');
  const apiSearchInput = document.getElementById('api-search-input');
  const apiSearchResults = document.getElementById('api-search-results');
  const apiSelectedView = document.getElementById('api-selected-item-view');
  const manualFormView = document.getElementById('manual-form-view');
  const apiSearchView = document.getElementById('api-search-view');
  const btnConfirmAdd = document.getElementById('btn-confirm-add');
  const apiAddForm = document.getElementById('api-add-form');
  
  // --- ADIÇÃO: NOVO SELETOR PARA O MODAL DE DESENVOLVEDORES ---
  const devsModal = document.getElementById('devs-modal');
  const statsOverlay = document.getElementById('stats-overlay');

  // ========================
  // Estado da Aplicação
  // ========================
  let state = {
    allFarmacos: [],
    displayedFarmacos: [],
    sort: { key: 'id', direction: 'asc' },
    pagination: { currentPage: 1, itemsPerPage: 50 },
    activeInfoBtn: null,
    // --- ADIÇÃO: NOVO ESTADO PARA CONTROLAR O MODAL DA API ---
    api: {
      selectedFarmaco: null, // Guarda o fármaco selecionado nos resultados da busca
      currentView: 'search'  // Controla qual tela do modal está visível: 'search' ou 'manual'
    }
  };
  
  let chartInstances = {};

  // ========================
  // Lógica de Tema (Original - Sem Alterações)
  // ========================
  const applyTheme = (theme) => {
      body.classList.toggle('dark-mode', theme === 'dark');
      localStorage.setItem('pharma_theme', theme);
  };
  const handleThemeToggle = () => applyTheme(body.classList.contains('dark-mode') ? 'light' : 'dark');

  // ========================
  // Funções de Renderização (Originais - Sem Alterações)
  // ========================
  const renderStats = (farmacos) => {
    statTotalItems.textContent = Farmacia.countFarmacos(farmacos);
    statTotalUnits.textContent = Farmacia.calculateQtdeTotal(farmacos);
    statTotalValue.textContent = Farmacia.calculateEstoqueValue(farmacos).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const renderPagination = () => {
      const { currentPage, itemsPerPage } = state.pagination;
      const totalItems = state.displayedFarmacos.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      paginationControls.innerHTML = '';
      if (totalPages <= 1) return;

      const createButton = (text, page, isDisabled = false, isActive = false) => {
          const btn = document.createElement('button');
          btn.innerHTML = text;
          btn.disabled = isDisabled;
          if (isActive) btn.classList.add('active');
          btn.addEventListener('click', () => {
              state.pagination.currentPage = page;
              render();
          });
          return btn;
      };

      paginationControls.appendChild(createButton('<<', 1, currentPage === 1));
      paginationControls.appendChild(createButton('<', currentPage - 1, currentPage === 1));
      
      const pagesToShow = [];
      if (totalPages <= 5) {
          for (let i = 1; i <= totalPages; i++) pagesToShow.push(i);
      } else {
          pagesToShow.push(1);
          if (currentPage > 3) pagesToShow.push('...');
          if (currentPage > 2) pagesToShow.push(currentPage - 1);
          if (currentPage !== 1 && currentPage !== totalPages) pagesToShow.push(currentPage);
          if (currentPage < totalPages - 1) pagesToShow.push(currentPage + 1);
          if (currentPage < totalPages - 2) pagesToShow.push('...');
          pagesToShow.push(totalPages);
      }
      
      const finalPages = [...new Set(pagesToShow)];

      finalPages.forEach(p => {
          if (p === '...') {
              const span = document.createElement('span');
              span.textContent = '...';
              paginationControls.appendChild(span);
          } else {
              paginationControls.appendChild(createButton(p, p, false, p === currentPage));
          }
      });

      paginationControls.appendChild(createButton('>', currentPage + 1, currentPage === totalPages));
      paginationControls.appendChild(createButton('>>', totalPages, currentPage === totalPages));
  };
  
  const renderTable = () => {
    const { currentPage, itemsPerPage } = state.pagination;
    const sortedFarmacos = Farmacia.sortFarmacos(state.displayedFarmacos, state.sort.key, state.sort.direction);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = sortedFarmacos.slice(startIndex, endIndex);

    tableBody.innerHTML = '';
    if (pageItems.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Nenhum fármaco encontrado.</td></tr>`;
      return;
    }

    pageItems.forEach(farmaco => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${farmaco.id}</td>
        <td><img class="farmaco-img" src="${farmaco.imagemUrl}" alt="${farmaco.nome}" onerror="this.src='https://placehold.co/50x50/e1e1e1/909090?text=Sem+Img';"></td>
        <td class="nome-cell">
            <div class="nome-cell-content">
                <span>${farmaco.nome}</span>
                <button class="info-btn" data-id="${farmaco.id}"><i data-feather="more-horizontal"></i></button>
            </div>
        </td>
        <td>${farmaco.marca}</td>
        <td>${farmaco.dosagem}</td>
        <td>${farmaco.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
        <td>${farmaco.quantidade}</td>
        <td>
          <button class="action-btn btn-update" data-id="${farmaco.id}"><i data-feather="edit-2"></i></button>
          <button class="action-btn btn-delete" data-id="${farmaco.id}"><i data-feather="trash-2"></i></button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
    feather.replace();
  };

  const render = (title = "Estoque de Fármacos") => {
      mainTitle.textContent = title;
      renderTable();
      renderPagination();
      renderStats(state.allFarmacos);
  };

  const updateAllFarmacos = (newFarmacos) => {
      state.allFarmacos = newFarmacos;
      state.displayedFarmacos = newFarmacos;
      state.pagination.currentPage = 1;
      Farmacia.saveFarmacos(state.allFarmacos);
      render();
  };
  
  const openModal = (modalElement) => { modalElement.style.display = 'flex'; };
  const closeModal = (modalElement) => { modalElement.style.display = 'none'; };

  const openFormModal = (mode, farmaco = {}) => {
    farmacoForm.reset();
    farmacoForm.dataset.mode = mode;
    farmacoForm.dataset.id = farmaco.id || '';
    document.getElementById('modal-title').textContent = mode === 'edit' ? 'Editar Fármaco' : 'Adicionar Novo Fármaco';
    
    if (mode === 'edit' && farmaco) {
        document.getElementById('nome').value = farmaco.nome || '';
        document.getElementById('marca').value = farmaco.marca || '';
        document.getElementById('dosagem').value = farmaco.dosagem || '';
        document.getElementById('qtdPorCaixa').value = farmaco.qtdPorCaixa || '';
        document.getElementById('preco').value = farmaco.preco || 0;
        document.getElementById('quantidade').value = farmaco.quantidade || 0;
        document.getElementById('categoria').value = farmaco.categoria || '';
        document.getElementById('imagemUrl').value = farmaco.imagemUrl || '';
    }
    openModal(formModal);
  };
  
  const openResultModal = (title, contentElement) => {
      document.getElementById('result-modal-title').textContent = title;
      const contentDiv = document.getElementById('result-modal-content');
      contentDiv.innerHTML = '';
      contentDiv.appendChild(contentElement);
      openModal(resultModal);
  };
  
  // --- ADIÇÃO: Função para criar e exibir notificações "toast" ---
  /**
   * Exibe uma notificação temporária (toast) na tela.
   * @param {string} message - A mensagem a ser exibida.
   * @param {string} type - O tipo de notificação ('success' ou 'error').
   */
  const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    
    // Cria o elemento da notificação
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Define o ícone com base no tipo
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    
    toast.innerHTML = `
      <i class="toast-icon" data-feather="${icon}"></i>
      <span>${message}</span>
    `;
    
    // Adiciona a notificação ao container
    container.appendChild(toast);
    feather.replace(); // Renderiza o novo ícone

    // Define um tempo para remover a notificação após a animação de saída
    setTimeout(() => {
        toast.remove();
    }, 4000); // 4 segundos no total (3.5s de animação + 0.5s de margem)
  };  

  // --- ADIÇÃO: NOVAS FUNÇÕES PARA O MODAL DE ADIÇÃO (API + MANUAL) ---

  /**
   * Renderiza os resultados da busca da API no modal.
   * @param {Array} results - A lista de fármacos filtrada para exibir.
   */
  const renderApiResults = (results) => {
    apiSearchResults.innerHTML = '';
    if (results.length === 0) {
      apiSearchResults.innerHTML = '<p style="padding: 1rem; text-align: center;">Nenhum fármaco encontrado no catálogo.</p>';
      return;
    }
    // Adiciona um listener de clique em cada item do resultado
    results.slice(0, 100).forEach(farmaco => {
      const div = document.createElement('div');
      div.className = 'api-result-item';
      div.innerHTML = `<h5>${farmaco.nome}</h5><p>${farmaco.marca} - ${farmaco.dosagem}</p>`;
      div.addEventListener('click', () => selectApiFarmaco(farmaco));
      apiSearchResults.appendChild(div);
    });
  };

  /**
   * Filtra os fármacos da API com base no termo de busca do usuário.
   */
  const handleApiSearch = (event) => {
    const term = event.target.value.toLowerCase();
    apiSelectedView.style.display = 'none';

    const allApiFarmacos = ApiMedicamentos.getAll();

    // Se a busca estiver vazia, mostra todos os itens.
    if (term.length === 0) {
        renderApiResults(allApiFarmacos);
        return;
    }
    
    // Se tiver 1 ou mais caracteres, filtra os resultados.
    const results = allApiFarmacos.filter(f =>
      f.nome.toLowerCase().includes(term) ||
      f.principioAtivo.toLowerCase().includes(term) ||
      f.marca.toLowerCase().includes(term)
    );
    renderApiResults(results);
  };

  /**
   * Lida com a seleção de um fármaco da lista de resultados, recebendo o objeto completo.
   * @param {Object} farmaco - O objeto do fármaco selecionado.
   */
  const selectApiFarmaco = (farmaco) => {
    if (!farmaco) return;
    state.api.selectedFarmaco = farmaco;
    document.getElementById('selected-item-details').innerHTML = `<p><strong>Nome:</strong> ${farmaco.nome}</p><p><strong>Marca:</strong> ${farmaco.marca} | <strong>Dosagem:</strong> ${farmaco.dosagem}</p>`;
    // Esconde a busca e mostra o formulário de quantidade/preço
    apiSearchInput.style.display = 'none';
    apiSearchResults.style.display = 'none';
    apiSelectedView.style.display = 'block';
    apiAddForm.reset();
    document.getElementById('api-preco').focus();
  };

  /**
   * Finaliza a adição do fármaco vindo da API ao estoque principal.
   */
  const handleAddFromApi = () => {
    if (!state.api.selectedFarmaco) return;

    // Cria o objeto do novo fármaco com os dados da API e do formulário
    const novoFarmaco = {
      ...state.api.selectedFarmaco,
      id: Farmacia.getNextId(state.allFarmacos), // ID provisório, pode não ser usado
      preco: parseFloat(document.getElementById('api-preco').value),
      quantidade: parseInt(document.getElementById('api-quantidade').value),
    };

    // Verifica se já existe um item igual no estoque
    const itemExistente = Farmacia.findDuplicateFarmaco(state.allFarmacos, novoFarmaco);

    if (itemExistente) {
      // Se existe, pergunta ao usuário se ele quer somar as quantidades
      const qtdNova = novoFarmaco.quantidade;
      const qtdAtual = itemExistente.quantidade;
      if (confirm(`Este item já existe com ${qtdAtual} unidades. Deseja somar a nova quantidade de ${qtdNova} ao estoque?`)) {
        // Se confirmar, atualiza a quantidade do item existente
        const quantidadeSomada = qtdAtual + qtdNova;
        updateAllFarmacos(Farmacia.updateFarmaco(state.allFarmacos, itemExistente.id, { quantidade: quantidadeSomada }));
      }
      // Se cancelar, não faz nada.
    } else {
      // Se não existe, adiciona o novo fármaco normalmente
      updateAllFarmacos(Farmacia.addFarmaco(state.allFarmacos, novoFarmaco));
      showToast('Fármaco adicionado com sucesso!');
    }

    closeModal(apiAddModal);
  };

  /**
   * Reseta o estado do modal de adição para sua condição inicial.
   */
  const resetApiModal = () => {
    state.api.selectedFarmaco = null;
    state.api.currentView = 'search';
    apiSearchInput.value = '';
    apiSearchInput.style.display = 'block';
    apiSearchResults.innerHTML = '';
    apiSearchResults.style.display = 'block';
    apiSelectedView.style.display = 'none';
    apiSearchView.style.display = 'block';
    manualFormView.style.display = 'none';
    document.getElementById('api-modal-title').textContent = 'Adicionar Fármaco do Catálogo';
    farmacoForm.reset();
  };
  
  // --- ADIÇÃO: LÓGICA COMPLETA PARA A NOVA TELA DE ESTATÍSTICAS ---

  /**
   * Esconde a tela de estatísticas, limpando seu conteúdo.
   */
  const hideStatsOverlay = () => {
    statsOverlay.classList.remove('visible');
    // Limpa o conteúdo para garantir que seja recriado na próxima vez
    setTimeout(() => {
        statsOverlay.innerHTML = '';
    }, 300); // Espera a animação de fade-out terminar
  }

  /**
   * Função principal que abre e constrói a tela de estatísticas.
   */
  const openStatsOverlay = () => {
    // 1. Constrói o HTML interno da tela de estatísticas dinamicamente
    statsOverlay.innerHTML = `
        <div class="stats-header">
            <h3>Estatísticas do Estoque</h3>
            <button class="stats-close-btn" id="btn-close-stats">
                <i data-feather="arrow-left"></i>
                <span>Voltar</span>
            </button>
        </div>
        <div class="stats-charts-grid">
            <div class="stats-chart-container">
                <h3>Distribuição por Categoria</h3>
                <canvas id="categoryPieChart"></canvas>
            </div>
            <div class="stats-chart-container">
                <h3>Top 5 Marcas (Unidades)</h3>
                <canvas id="topMarcasBarChart"></canvas>
            </div>
            <div class="stats-chart-container full-width">
                <h3>Valor do Estoque por Categoria (R$)</h3>
                <canvas id="categoryValueBarChart"></canvas>
            </div>
        </div>
    `;
    
    // 2. Adiciona o listener para o novo botão de fechar
    document.getElementById('btn-close-stats').addEventListener('click', hideStatsOverlay);
    feather.replace(); // Renderiza o ícone do botão "Voltar"

    // 3. Mostra a tela
    statsOverlay.classList.add('visible');

    // --- CORREÇÃO FINAL DE TIMING ---
    // Envolve a chamada dos gráficos em um setTimeout de 0ms.
    // Isso coloca a renderização dos gráficos no final da fila de execução,
    // garantindo que o HTML acima já foi processado pelo navegador.
    setTimeout(() => {
        renderCharts();
    }, 0);
  }
  
  /**
   * Função que busca os dados no lib.js e chama a criação de cada gráfico.
   */
  const renderCharts = () => {
    const farmacos = state.allFarmacos;
    if (farmacos.length === 0) {
        document.querySelector('.stats-charts-grid').innerHTML = '<p style="color: var(--text-secondary); font-size: 1.2rem; text-align: center; grid-column: 1 / -1;">Não há dados no estoque para exibir estatísticas.</p>';
        return;
    }

    const pieChartData = Farmacia.getDataForCategoryPieChart(farmacos);
    createCategoryPieChart(pieChartData);

    const topMarcasData = Farmacia.getDataForTopMarcasBarChart(farmacos);
    createTopMarcasBarChart(topMarcasData);

    const categoryValueData = Farmacia.getDataForCategoryValueBarChart(farmacos);
    createCategoryValueBarChart(categoryValueData);
  }

  /**
   * Cria (ou atualiza) o gráfico de pizza.
   */
  const createCategoryPieChart = ({ labels, data }) => {
    const ctx = document.getElementById('categoryPieChart').getContext('2d');
    if (chartInstances.categoryPie) {
      chartInstances.categoryPie.destroy();
    }
    const modernColors = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6f42c1', '#fd7e14', '#20c997', '#6610f2', '#e83e8c', '#dc3545'];
    chartInstances.categoryPie = new Chart(ctx, {
      type: 'pie', data: { labels, datasets: [{ label: 'Nº de Itens', data, backgroundColor: modernColors, hoverOffset: 8, borderWidth: 2, borderColor: body.classList.contains('dark-mode') ? '#1e1e1e' : '#ffffff', }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 20, padding: 15, font: { size: 12 } } },
          // --- ADIÇÃO: Aumenta o tamanho da fonte do tooltip ---
          tooltip: {
            titleFont: { size: 14 },
            bodyFont: { size: 12 }
          }
        }
      }
    });
  }

  /**
   * Cria (ou atualiza) o gráfico de barras verticais.
   */
  const createTopMarcasBarChart = ({ labels, data }) => {
    const ctx = document.getElementById('topMarcasBarChart').getContext('2d');
    if (chartInstances.topMarcasBar) {
      chartInstances.topMarcasBar.destroy();
    }
    chartInstances.topMarcasBar = new Chart(ctx, {
      type: 'bar', data: { labels, datasets: [{ label: 'Total de Unidades em Estoque', data, backgroundColor: 'rgba(0, 123, 255, 0.7)', borderColor: 'rgba(0, 123, 255, 1)', borderWidth: 1, hoverBackgroundColor: 'rgba(0, 123, 255, 1)', }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          // --- ADIÇÃO: Aumenta o tamanho da fonte do tooltip ---
          tooltip: {
            titleFont: { size: 14 },
            bodyFont: { size: 12 }
          }
        },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  /**
   * Cria (ou atualiza) o gráfico de barras horizontais.
   */
  const createCategoryValueBarChart = ({ labels, data }) => {
    const ctx = document.getElementById('categoryValueBarChart').getContext('2d');
    if (chartInstances.categoryValueBar) {
      chartInstances.categoryValueBar.destroy();
    }
    chartInstances.categoryValueBar = new Chart(ctx, {
      type: 'bar', data: { labels, datasets: [{ label: 'Valor Total (R$)', data, backgroundColor: 'rgba(255, 193, 7, 0.7)', borderColor: 'rgba(255, 193, 7, 1)', borderWidth: 1, hoverBackgroundColor: 'rgba(255, 193, 7, 1)', }] },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            // --- ADIÇÃO: Aumenta o tamanho da fonte E mantém a formatação de moeda ---
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
            callbacks: {
              label: (c) => `${c.dataset.label}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.parsed.x)}`
            }
          }
        },
        scales: { x: { beginAtZero: true } }
      }
    });
  }

  // ========================
  // Handlers de Eventos
  // ========================
  
  const handleListAll = () => {
    state.displayedFarmacos = state.allFarmacos;
    state.pagination.currentPage = 1;
    state.pagination.itemsPerPage = 50; 
    render("Estoque de Fármacos");
  };

  // --- MODIFICAÇÃO: O botão de Adicionar agora chama o novo modal da API. ---
  const handleAdd = () => {
    resetApiModal(); // Reseta o modal para o estado inicial
    openModal(apiAddModal); // Abre o modal
    
    // ADIÇÃO: Pega todos os itens da API e renderiza na tela imediatamente
    const allApiItems = ApiMedicamentos.getAll();
    renderApiResults(allApiItems);
  };
  
  const handleReset = () => {
    if (confirm("Você tem certeza que quer apagar tudo e resetar para o estoque inicial?")) {
      updateAllFarmacos(Farmacia.resetFarmacos());
      showToast('Estoque resetado para o padrão.');
    }
  };

  // --- ADIÇÃO: Novo handler para o botão "Limpar Estoque". ---
  const handleClearStock = () => {
    if (confirm("Você tem certeza que quer LIMPAR TODO o estoque? Esta ação não pode ser desfeita e o estoque ficará vazio.")) {
      updateAllFarmacos(Farmacia.clearAllFarmacos());
      showToast('Estoque limpo com sucesso!');
    }
  };
  
  // --- MODIFICAÇÃO: Ajuste no fechamento do modal para adição manual. ---
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const mode = farmacoForm.dataset.mode;
    const id = Number(farmacoForm.dataset.id);
    const farmacoData = {
        nome: document.getElementById('nome').value,
        marca: document.getElementById('marca').value,
        preco: parseFloat(document.getElementById('preco').value),
        quantidade: parseInt(document.getElementById('quantidade').value),
        categoria: document.getElementById('categoria').value,
        imagemUrl: document.getElementById('imagemUrl').value,
        dosagem: document.getElementById('dosagem').value,
        qtdPorCaixa: document.getElementById('qtdPorCaixa').value,
    };

    if (mode === 'add') {
      // Lógica de verificação de duplicata para ADIÇÃO MANUAL
      const itemExistente = Farmacia.findDuplicateFarmaco(state.allFarmacos, farmacoData);
      if (itemExistente) {
        const qtdNova = farmacoData.quantidade;
        const qtdAtual = itemExistente.quantidade;
        if (confirm(`Este item já existe com ${qtdAtual} unidades. Deseja somar a nova quantidade de ${qtdNova} ao estoque?`)) {
          const quantidadeSomada = qtdAtual + qtdNova;
          updateAllFarmacos(Farmacia.updateFarmaco(state.allFarmacos, itemExistente.id, { quantidade: quantidadeSomada }));
        }
      } else {
        farmacoData.id = Farmacia.getNextId(state.allFarmacos);
        updateAllFarmacos(Farmacia.addFarmaco(state.allFarmacos, farmacoData));
        showToast('Fármaco adicionado manualmente!');
      }
      closeModal(apiAddModal);

    } else if (mode === 'edit') {
      // A lógica de edição continua a mesma, sem alterações
      const originalFarmaco = Farmacia.findFarmacoById(state.allFarmacos, id);
      const updatedData = { ...originalFarmaco, ...farmacoData };
      updateAllFarmacos(Farmacia.updateFarmaco(state.allFarmacos, id, updatedData));
      showToast('Fármaco atualizado com sucesso!');
      closeModal(formModal);
    }
  };

  // Funções de handler originais - sem alterações
  const handleSearch = (event) => {
      const searchTerm = event.target.value;
      state.displayedFarmacos = Farmacia.searchFarmacos(state.allFarmacos, searchTerm);
      state.pagination.currentPage = 1;
      render(`Resultados para "${searchTerm}"`);
  };
  const populateFilterValues = () => {
      const filterType = document.getElementById('filter-type').value;
      const values = Farmacia.getUniqueValuesByKey(state.allFarmacos, filterType);
      const selectValue = document.getElementById('filter-value');
      selectValue.innerHTML = values.map(v => `<option value="${v}">${v}</option>`).join('');
  };
  const handleSort = (event) => {
      const newKey = event.currentTarget.dataset.sortBy;
      const { key, direction } = state.sort;
      let newDirection = (newKey === key && direction === 'asc') ? 'desc' : 'asc';
      state.sort = { key: newKey, direction: newDirection };
      document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('asc', 'desc'));
      event.currentTarget.classList.add(newDirection);
      render();
  };
  const handleRemoveDuplicates = () => {
    const originalCount = state.allFarmacos.length;
    const farmacosSemDuplicatas = Farmacia.removeDuplicates(state.allFarmacos);
    const finalCount = farmacosSemDuplicatas.length;
    const removedCount = originalCount - finalCount;
    updateAllFarmacos(farmacosSemDuplicatas);
    const container = document.createElement('div');
    container.className = 'duplicates-result';
    container.innerHTML = `
        <div class="stat-item original"><span>${originalCount}</span><p>Itens Originais</p></div>
        <div class="stat-item removed"><span>${removedCount}</span><p>Duplicatas Removidas</p></div>
        <div class="stat-item final"><span>${finalCount}</span><p>Itens Finais</p></div>
    `;
    openResultModal('Remover Duplicatas', container);
  };
  const handleCheapestByName = () => {
      state.displayedFarmacos = Farmacia.findCheapestOfEachFarmaco(state.allFarmacos);
      state.pagination.currentPage = 1;
      render('Análise: Mais Baratos por Nome');
      closeModal(priceAnalysisModal);
  };
  const handleCheapestByBrand = () => {
      state.displayedFarmacos = Farmacia.findCheapestOfEachMarca(state.allFarmacos);
      state.pagination.currentPage = 1;
      render('Análise: Mais Baratos por Marca');
      closeModal(priceAnalysisModal);
  };
  const handleTableScroll = () => {
    if (state.activeInfoBtn && infoPopover.classList.contains('visible')) {
      const containerRect = tableContainer.getBoundingClientRect();
      const buttonRect = state.activeInfoBtn.getBoundingClientRect();
      if (buttonRect.top < containerRect.top || buttonRect.bottom > containerRect.bottom) {
        infoPopover.classList.remove('visible');
        state.activeInfoBtn = null;
      } else {
        infoPopover.style.left = `${buttonRect.left}px`;
        infoPopover.style.top = `${buttonRect.bottom + 5}px`;
      }
    }
  };

  // ========================
  // Inicialização e Event Listeners
  // ========================
  const main = () => {
    // --- ADICIONE ESTE BLOCO DE CÓDIGO AQUI ---
    // Define a cor padrão para todo o texto (legendas, eixos) dos gráficos
    // Ele pega a cor da variável CSS '--text-secondary' que já muda com o tema
    Chart.defaults.color = getComputedStyle(body).getPropertyValue('--text-secondary').trim();
    // -----------------------------------------
    const savedTheme = localStorage.getItem('pharma_theme') || 'light';
    applyTheme(savedTheme);
    const farmacosSalvos = Farmacia.loadFarmacos();
    state.allFarmacos = farmacosSalvos.length > 0 ? farmacosSalvos : Farmacia.resetFarmacos();
    state.displayedFarmacos = state.allFarmacos;
    render();
    
    // Listeners Estáticos Originais
    themeToggle.addEventListener('click', handleThemeToggle);
    // Garante que o botão "Listar Todos" feche a tela de stats se estiver aberta
    document.getElementById('btn-list-all').addEventListener('click', () => {
        hideStatsOverlay();
        handleListAll(); // Chama a função original para resetar a tabela
    });
    // --- ADIÇÃO: Listener para o botão de Estatísticas ---
    document.getElementById('btn-show-stats').addEventListener('click', openStatsOverlay);
    document.getElementById('btn-reset').addEventListener('click', handleReset);
    document.getElementById('btn-add').addEventListener('click', handleAdd);
    document.getElementById('btn-open-filter-modal').addEventListener('click', () => {
        populateFilterValues();
        openModal(filterModal);
    });
    document.getElementById('filter-type').addEventListener('change', populateFilterValues);
    searchInput.addEventListener('input', handleSearch);
    farmacoForm.addEventListener('submit', handleFormSubmit);
    document.getElementById('btn-remove-duplicates').addEventListener('click', handleRemoveDuplicates);
    document.getElementById('btn-chunk').addEventListener('click', () => openModal(chunkModal));
    document.getElementById('btn-price-analysis').addEventListener('click', () => openModal(priceAnalysisModal));
    document.getElementById('btn-cheapest-by-name').addEventListener('click', handleCheapestByName);
    document.getElementById('btn-cheapest-by-brand').addEventListener('click', handleCheapestByBrand);
    document.querySelectorAll('.sort-btn').forEach(btn => btn.addEventListener('click', handleSort));

    // --- ADIÇÃO: Listener para o novo botão "Limpar Estoque". ---
    document.getElementById('btn-clear-stock').addEventListener('click', handleClearStock);

    // --- ADIÇÃO: Listener para o novo botão "Desenvolvedores". ---
    document.getElementById('btn-show-devs').addEventListener('click', () => {
        openModal(devsModal);
        feather.replace(); // Garante que os ícones (github/linkedin) sejam renderizados
    });
    
    document.getElementById('btn-show-stats').addEventListener('click', openStatsOverlay);

    // --- ADIÇÃO: Bloco de listeners para o novo modal da API. ---
    apiSearchInput.addEventListener('input', handleApiSearch);
    document.getElementById('btn-toggle-manual-form').addEventListener('click', (event) => {
        const btn = event.currentTarget;
        // Localiza o rodapé com os botões DENTRO do formulário
        const formActions = farmacoForm.querySelector('.modal-actions'); 
        
        state.api.currentView = state.api.currentView === 'search' ? 'manual' : 'search';
      
        if (state.api.currentView === 'manual') {
            // MODO MANUAL
            apiSearchView.style.display = 'none';
            manualFormView.style.display = 'block';
            document.getElementById('api-modal-title').textContent = 'Adicionar Fármaco Manualmente';
            farmacoForm.dataset.mode = 'add';
            manualFormView.appendChild(farmacoForm);
            
            // --- CORREÇÃO: Esconde os botões duplicados do formulário ---
            if (formActions) formActions.style.display = 'none';

            // Melhoria UX: Muda o ícone para "voltar"
            btn.innerHTML = '<i data-feather="arrow-left"></i>';
            btn.title = 'Voltar para a busca';
            feather.replace();

        } else {
            // MODO BUSCA (RETORNO)
            resetApiModal();
            renderApiResults(ApiMedicamentos.getAll());
            
            // --- CORREÇÃO: Mostra os botões do formulário novamente ---
            // Isso garante que a tela de EDITAR funcione corretamente.
            if (formActions) formActions.style.display = 'flex';
            
            formModal.appendChild(farmacoForm);

            // Melhoria UX: Restaura o ícone para "+"
            btn.innerHTML = '<i data-feather="plus"></i>';
            btn.title = 'Adicionar Manualmente';
            feather.replace();
        }
    });
    btnConfirmAdd.addEventListener('click', () => {
      if (state.api.currentView === 'search') {
        if (apiAddForm.checkValidity()) {
          handleAddFromApi();
        } else {
          apiAddForm.reportValidity();
        }
      } else { // 'manual'
        if (farmacoForm.checkValidity()) {
          farmacoForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        } else {
          farmacoForm.reportValidity();
        }
      }
    });
    // --- Fim do novo bloco de listeners ---

    filterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const type = document.getElementById('filter-type').value;
      const value = document.getElementById('filter-value').value;
      state.displayedFarmacos = type === 'marca'
          ? state.allFarmacos.filter(f => f.marca === value)
          : state.allFarmacos.filter(f => f.categoria === value);
      state.pagination.currentPage = 1;
      render(`Filtrando por ${type}: ${value}`);
      closeModal(filterModal);
    });
    chunkForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const n = parseInt(document.getElementById('chunk-size').value);
      if (n > 0) {
          state.pagination.itemsPerPage = n;
          state.pagination.currentPage = 1;
          render(`Itens Agrupados em Páginas de ${n}`);
          closeModal(chunkModal);
      }
    });

    // Listener Global para fechar modais (Original)
    document.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-overlay');
        if (modal && (e.target.dataset.action === 'close-modal' || e.target === modal)) {
            closeModal(modal);
        }
    });

    // Listener Centralizado para Ações na Tabela (Original - Sem Alterações)
    tableBody.addEventListener('click', (e) => {
        const infoBtn = e.target.closest('.info-btn');
        const img = e.target.closest('.farmaco-img');
        const deleteBtn = e.target.closest('.btn-delete');
        const updateBtn = e.target.closest('.btn-update');

        if (infoBtn) {
            const id = Number(infoBtn.dataset.id);
            if (infoPopover.classList.contains('visible') && infoPopover.dataset.id == id) {
                infoPopover.classList.remove('visible');
                state.activeInfoBtn = null;
                return;
            }
            
            infoPopover.classList.remove('visible');

            const farmaco = Farmacia.findFarmacoById(state.allFarmacos, id);
            if (farmaco) {
                infoPopover.innerHTML = `
                    <span>${farmaco.qtdPorCaixa}</span>
                    <span class="popover-pa"><strong>P.A.:</strong> ${farmaco.principioAtivo}</span>
                `;
                infoPopover.dataset.id = id;
                const rect = infoBtn.getBoundingClientRect();
                infoPopover.style.left = `${rect.left}px`;
                infoPopover.style.top = `${rect.bottom + 5}px`;
                infoPopover.classList.add('visible');
                state.activeInfoBtn = infoBtn; 
            }
        } else if (img) {
            document.getElementById('image-viewer-content').src = img.src;
            openModal(imageViewerModal);
        } else if (deleteBtn) {
            const id = Number(deleteBtn.dataset.id);
            if (confirm(`Tem certeza que quer excluir o fármaco com ID ${id}?`)) {
                updateAllFarmacos(Farmacia.deleteFarmaco(state.allFarmacos, id));
                showToast('Fármaco excluído com sucesso!');
            }
        } else if (updateBtn) {
            const id = Number(updateBtn.dataset.id);
            const farmacoToEdit = Farmacia.findFarmacoById(state.allFarmacos, id);
            if (farmacoToEdit) openFormModal('edit', farmacoToEdit);
        } else {
            infoPopover.classList.remove('visible');
            state.activeInfoBtn = null;
        }
    });

    tableContainer.addEventListener('scroll', handleTableScroll);
  };

  main();
});
