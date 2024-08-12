document.addEventListener('DOMContentLoaded', function() {
    const marcaInput = document.getElementById('marca');
    const marcaSelect = document.getElementById('marca-select');
    const modelosDiv = document.getElementById('modelos');

    function preencherMarcas(marcas) {
        const datalist = document.getElementById('marcas-datalist');
        datalist.innerHTML = '';
        marcaSelect.innerHTML = '<option value="">Selecione uma marca</option>';

        marcas.forEach(marca => {
            // Add options to datalist
            const optionDatalist = document.createElement('option');
            optionDatalist.value = marca.nome;
            datalist.appendChild(optionDatalist);

            // Add options to select dropdown
            const optionSelect = document.createElement('option');
            optionSelect.value = marca.codigo;
            optionSelect.textContent = marca.nome;
            marcaSelect.appendChild(optionSelect);
        });
    }

    function buscarModelos(codigoMarca) {
        fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos`)
            .then(response => response.json())
            .then(data => {
                modelosDiv.innerHTML = '';
                if (data.modelos && data.modelos.length > 0) {
                    const ul = document.createElement('ul');
                    data.modelos.forEach(modelo => {
                        const li = document.createElement('li');
                        li.textContent = modelo.nome;
                        ul.appendChild(li);
                    });
                    modelosDiv.appendChild(ul);
                } else {
                    modelosDiv.textContent = 'Nenhum modelo encontrado para a marca selecionada.';
                }
            })
            .catch(error => {
                modelosDiv.textContent = 'Erro ao buscar modelos. Tente novamente mais tarde.';
                console.error('Erro ao buscar modelos:', error);
            });
    }

    function buscarMarcas() {
        fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas')
            .then(response => response.json())
            .then(data => {
                preencherMarcas(data);
            })
            .catch(error => {
                console.error('Erro ao buscar marcas:', error);
                alert('Erro ao buscar marcas. Tente novamente mais tarde.');
            });
    }

    function buscarCodigoMarca(nomeMarca) {
        return fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas')
            .then(response => response.json())
            .then(data => {
                const marca = data.find(marca => marca.nome.toLowerCase() === nomeMarca.toLowerCase());
                return marca ? marca.codigo : null;
            })
            .catch(error => {
                console.error('Erro ao buscar código da marca:', error);
                return null;
            });
    }

    marcaInput.addEventListener('input', function() {
        const valor = marcaInput.value.trim();
        if (valor) {
            buscarCodigoMarca(valor)
                .then(codigoMarca => {
                    if (codigoMarca) {
                        buscarModelos(codigoMarca);
                    } else {
                        modelosDiv.textContent = 'Marca desconhecida ou sem modelos.';
                    }
                })
                .catch(error => {
                    modelosDiv.textContent = 'Erro ao buscar a marca. Tente novamente mais tarde.';
                    console.error('Erro ao buscar a marca:', error);
                });
        } else {
            modelosDiv.innerHTML = '';
        }
    });

    marcaSelect.addEventListener('change', function() {
        const codigoMarca = marcaSelect.value;
        if (codigoMarca) {
            buscarModelos(codigoMarca);
        } else {
            modelosDiv.innerHTML = '';
        }
    });

    buscarMarcas();
});