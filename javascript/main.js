var geocoder;
				var map;
				var activeMarker;
				var markers = [];
				var negocios = 
				[{
					"nome" : "Dindins da Ana",
					"categoria" : "alimentos",
					"filtros" : ["domicilio"],
					"latitude" : -5.829471633091929,
					"longitude" : -35.20443320274353
				},
				{
					"nome" : "Salgados Nota 10",
					"categoria" : "alimentos",
					"filtros" : ["cartao", "domicilio"],
					"latitude" : -5.830282807327257,
					"longitude" : -35.20439028739929
			    },
			    {
			    	"nome" : "Marmitaria Express",
					"categoria" : "alimentos",
					"filtros" : ["cartao", "domicilio"],
					"latitude" : -5.830154727262788,
					"longitude" : -35.20589232444763
			    },
			    {
			    	"nome" : "Milk Shake do Jaiminho",
					"categoria" : "bebidas",
					"filtros" : ["cartao"],
					"latitude" : -5.831478219852342,
					"longitude" : -35.206578969955444
			    },
			    {
			    	"nome" : "Rapidão Reparos",
					"categoria" : "servicos_dom",
					"filtros" : ["24h", "domicilio"],
					"latitude" : -5.832673629830183,
					"longitude" : -35.20370364189148
			    },
			    {
			    	"nome" : "Mário Monta-Móveis",
					"categoria" : "servicos_dom",
					"filtros" : ["domicilio"],
					"latitude" : -5.830731087322634,
					"longitude" : -35.207051038742065
			    },
			    {
			    	"nome" : "Fast Depyl",
					"categoria" : "servicos_est",
					"filtros" : ["24h", "domicilio"],
					"latitude" : -5.830923207211005,
					"longitude" : -35.20286679267883
			    }];

				function setMapCenter(){
					// Mapa carrega nas imediações do IMD
					map.setCenter(new google.maps.LatLng(-5.831977, -35.2049248));
				}

				function setMapOnCurrentPosition() {
				  navigator.geolocation.getCurrentPosition(function(position) {
				    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				    map.setCenter(latlng);
				  });
				}

				function initialize() {
				    geocoder = new google.maps.Geocoder();
				    var mapOptions = { zoom: 16 }
				    map = new google.maps.Map(document.getElementById("map"), mapOptions);
				    setMapCenter();
				    addExampleMarkers();
				}

				function placeMarker(position, map) {
				    var marker = new google.maps.Marker({
				        position: position,
				        map: map
				    });
				    // map.panTo(position);
				}

				function addExampleMarkers() {
					for (var i = 0; i < negocios.length; i++) {
						var marker = new google.maps.Marker({
					        position: new google.maps.LatLng(negocios[i].latitude, negocios[i].longitude),
					        map: map
					    });
					    var markerWithInfo = {
					    	"marker" : marker,
					    	"active" : true
					    }
					    markers.push(markerWithInfo);
					    addLabelForMarker(marker, negocios[i]);
					}
				}

				function addLabelForMarker(marker, negocioJSON) {
				    var coordInfoWindow = new google.maps.InfoWindow();
				    coordInfoWindow.setPosition(new google.maps.LatLng(negocioJSON.latitude, negocioJSON.longitude));

				    marker.addListener('click', function() {
				        var infoNegocioBox = document.createElement("p");
				        
				        var infoNegocioNome = document.createTextNode(negocioJSON.nome);
				        infoNegocioBox.appendChild(infoNegocioNome);
				        infoNegocioBox.appendChild(document.createElement("br"));

			        	var catNegocio;
			        	if(negocioJSON.categoria == "alimentos")
			        		catNegocio = "Alimentos";
			        	else if(negocioJSON.categoria == "bebidas")
			        		catNegocio = "Bebidas";
			        	else if(negocioJSON.categoria == "servicos_dom")
			        		catNegocio = "Serviços Domésticos";
			        	else if(negocioJSON.categoria == "servicos_est")
			        		catNegocio = "Serviços Estéticos";

				        var infoNegocioCategoria = document.createTextNode(catNegocio);
				        infoNegocioBox.appendChild(infoNegocioCategoria);
				        infoNegocioBox.appendChild(document.createElement("br"));

				        if(negocioJSON.filtros.includes("24h")) {
				        	var filtro1 = document.createTextNode("- Atendimento 24h");
					        infoNegocioBox.appendChild(filtro1);
					        infoNegocioBox.appendChild(document.createElement("br"));
				        }

				        if(negocioJSON.filtros.includes("cartao")) {
				        	var filtro1 = document.createTextNode("- Aceita cartão");
					        infoNegocioBox.appendChild(filtro1);
					        infoNegocioBox.appendChild(document.createElement("br"));
				        }

				        if(negocioJSON.filtros.includes("domicilio")) {
				        	var filtro1 = document.createTextNode("- Atendimento à domicílio");
					        infoNegocioBox.appendChild(filtro1);
					        infoNegocioBox.appendChild(document.createElement("br"));
				        }
				        
				        coordInfoWindow.setContent(infoNegocioBox);
				        coordInfoWindow.open(map);
				        if(typeof activeMarker !== "undefined" && activeMarker !== null) activeMarker.close();
				        activeMarker = coordInfoWindow;
				    });
				}

				function filtrarCategorias(){
					var categoria = document.getElementById("select_categorias").value;

					if (categoria == "todas") {
						for (var i = 0; i < negocios.length; i++) {
							markers[i].active = true;
						}
					} else {
						for (var i = 0; i < negocios.length; i++) {
							if (negocios[i].categoria == categoria) {
								markers[i].active = true;
							} else {
								markers[i].active = false;
							}
						}
					}
				}

				function filtrarTipoServico(){
					var h24 = document.getElementById('checkbox_24h').checked;
					var cartao = document.getElementById('checkbox_cartao').checked;
					var domicilio = document.getElementById('checkbox_domicilio').checked;
					for (var i = 0; i < negocios.length; i++) {
						if (h24) {
							if (!negocios[i].filtros.includes("24h")) {
								markers[i].active = false;
							}
						}

						if (cartao) {
							if (!negocios[i].filtros.includes("cartao")) {
								markers[i].active = false;
							}
						}

						if (domicilio) {
							if (!negocios[i].filtros.includes("domicilio")) {
								markers[i].active = false;
							}
						}
					}
				}

				function filtrarNome(){
					var nome = document.getElementById("input_nome").value;

					if (nome == "") return;

					for (var i = 0; i < negocios.length; i++) {
						if (negocios[i].nome.toLowerCase().indexOf(nome.toLowerCase()) == -1) {
							markers[i].active = false;
						}
					}
				}

				function updateMarkers() {
					filtrarCategorias();
					filtrarTipoServico();
					filtrarNome();

					for (var i = 0; i < negocios.length; i++) {
						markers[i].active ? markers[i].marker.setMap(map) : markers[i].marker.setMap(null);
					}
				}