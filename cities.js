const brazilianStates = {
    "AC": "Acre",
    "AL": "Alagoas",
    "AP": "Amapá",
    "AM": "Amazonas",
    "BA": "Bahia",
    "CE": "Ceará",
    "DF": "Distrito Federal",
    "ES": "Espírito Santo",
    "GO": "Goiás",
    "MA": "Maranhão",
    "MT": "Mato Grosso",
    "MS": "Mato Grosso do Sul",
    "MG": "Minas Gerais",
    "PA": "Pará",
    "PB": "Paraíba",
    "PR": "Paraná",
    "PE": "Pernambuco",
    "PI": "Piauí",
    "RJ": "Rio de Janeiro",
    "RN": "Rio Grande do Norte",
    "RS": "Rio Grande do Sul",
    "RO": "Rondônia",
    "RR": "Roraima",
    "SC": "Santa Catarina",
    "SP": "São Paulo",
    "SE": "Sergipe",
    "TO": "Tocantins"
};

// Objeto para armazenar as cidades por estado
const citiesByState = {};

// Função para carregar o CSV de municípios
async function loadMunicipiosCSV() {
    try {
        console.log('Iniciando carregamento do CSV...');
        const response = await fetch('municipios.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('CSV carregado, tamanho:', text.length, 'bytes');

        // Limpar o objeto de cidades
        Object.keys(citiesByState).forEach(key => delete citiesByState[key]);

        // Processar o CSV
        const lines = text.split('\n');
        console.log('Número de linhas:', lines.length);

        // Pular o cabeçalho
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            try {
                if (!line.trim()) continue;

                // Remover BOM e espaços extras
                const cleanLine = line.trim().replace(/^\uFEFF/, '');
                const parts = cleanLine.split(';');

                if (parts.length < 4) {
                    console.log('Linha inválida:', line);
                    continue;
                }

                // Extrair dados
                const uf = parts[3].trim();
                const cityName = parts[1].trim();

                // Validar UF
                if (!uf || uf.length !== 2) {
                    console.log('UF inválida:', uf);
                    continue;
                }

                // Inicializar array do estado se necessário
                if (!citiesByState[uf]) {
                    citiesByState[uf] = [];
                }

                // Adicionar cidade se não existir
                if (cityName && !citiesByState[uf].includes(cityName)) {
                    citiesByState[uf].push(cityName);
                }
            } catch (err) {
                console.error('Erro ao processar linha:', line, err);
            }
        }

        // Ordenar cidades de cada estado
        for (let uf in citiesByState) {
            citiesByState[uf].sort((a, b) => a.localeCompare(b, 'pt-BR'));
            console.log(`${uf}: ${citiesByState[uf].length} cidades carregadas`);
        }

        // Disparar evento de carregamento concluído
        window.dispatchEvent(new Event('citiesLoaded'));

        return true;
    } catch (error) {
        console.error('Erro ao carregar municípios:', error);
        return false;
    }
}

// Função para obter todas as cidades de um estado
function getCitiesByState(stateCode) {
    console.log('Buscando cidades para:', stateCode);
    return citiesByState[stateCode] || [];
}

// Função para obter todos os estados
function getAllStates() {
    return Object.entries(brazilianStates).map(([code, name]) => ({
        code: code,
        name: name
    }));
}

// Função para popular o select de cidades
function populateCitySelect(stateValue, citySelectId) {
    console.log('Populando cidades para', stateValue);
    const citySelect = document.getElementById(citySelectId);
    
    if (!citySelect) {
        console.error('Elemento select não encontrado:', citySelectId);
        return;
    }
    
    if (!stateValue) {
        citySelect.innerHTML = '<option value="">Selecione a Cidade</option>';
        return;
    }

    citySelect.innerHTML = '<option value="">Carregando cidades...</option>';
    
    const cities = getCitiesByState(stateValue);
    console.log(`${cities.length} cidades encontradas para ${stateValue}`);
    
    if (cities.length === 0) {
        citySelect.innerHTML = '<option value="">Nenhuma cidade encontrada</option>';
        return;
    }
    
    citySelect.innerHTML = '<option value="">Selecione a Cidade</option>';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// Inicializar o carregamento das cidades
(async function() {
    console.log('Iniciando carregamento inicial...');
    const success = await loadMunicipiosCSV();
    console.log('Carregamento inicial:', success ? 'sucesso' : 'falha');
})();

// Exportar as funções e dados
window.brazilianStates = brazilianStates;
window.citiesByState = citiesByState;
window.getCitiesByState = getCitiesByState;
window.getAllStates = getAllStates;
window.populateCitySelect = populateCitySelect;

// Inicializar EmailJS
emailjs.init("qkQHAL_GwdL8J4T-O");

// Função para enviar comprovante
async function enviarComprovante(templateParams) {
    try {
        await emailjs.send(
            'service_5tpgwf2',
            'Order Confirmed #{{order_id}}!SEU_TEMPLATE_ID',
            templateParams
        );
        console.log('Comprovante enviado com sucesso');
    } catch (error) {
        console.error('Erro ao enviar comprovante:', error);
    }
} 