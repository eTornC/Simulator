import axios from 'axios';
import swal from 'sweetalert';
class DBManager{
	constructor(nomTest){
		this._DB_NAME   = 'etorn';
    	this._DB_USER   = 'root';
    	this._DB_PASSWD = '';
    	this._nomTest = nomTest;
    	this._host = 'http://etorn.localhost';
    	this._prefix = '';
		this._storeTest = null;

    	//const url ="https://labs.iam.cat/~a16josortmar/eTorn/store/" + idStore  + "/nextTurn";
    	//this.crearTest();
	}

	//No cal ara mateix
	async crearTest(){
		const url = this._host + this._prefix +'/test';


		let formData = new FormData();
		formData.append('name', this._nomTest);
		var res = await axios.post(url, formData);
		if(res.data.done){
			swal('ÈXIT : ' + res.data.done, 'S\'ha creat el test amb nom "'+ this._nomTest +'"!');
			await this.crearStore();
			return true;
		} 
		else {	
			swal( 'ERROR : ' + res.data.done, 'Fail al començar el test "' + this._nomTest + '"');
			return false;
		}
	}
	async downloadStores() {

		const url =  this._host + this._prefix + '/stores';

		await axios.get(url).then((res) => {
				this.stores = res.data;
			}).catch(err => {
				console.log('Fail');
		});
		for(var index in this.stores){
			var store = this.stores[index];
			if(store.name === this._nomTest){
  				this._storeTest = store;
  			} 
		}
		return this.stores;
	}

	async crearStore(){
		const url = this._host + this._prefix +'/store';
		let formData = new FormData();
		formData.append('name', this._nomTest);
		var file = new File(["foo"], "a.png", {
		  type: "image/png",
		});
		formData.append('photoStore', file);
		console.log(url);

		var res = await axios.post(url, formData);
		console.log(res);
		console.log(res.data.done);
		if(res.data.done){
			swal('ÈXIT : ' + res.data.done, 'S\'ha creat la store amb nom "'+ this._nomTest +'"!');
			await this.downloadStores();
			return true;
		} 
		else {	
			 swal( 'ERROR : ' + res.data.done, 'Fail al començar el test "' + this._nomTest + '"');
			return false;
		}
		
	}

	async crearTurnNormal(){

		const url = this._host + this._prefix +'/store/'+this._storeTest.id+'/turn';
		console.log(url);
		//console.log(await axios.post(url));

		axios.post(url).then(response => {
                if (response.data.done) {
                	console.log("1***************");
                    console.log(response)
                } else {
                	console.log("2***************");
                	console.log(response)
                }
            })
            .catch(err => {
                this.$swal('Error: ' + err)
            })
	}
	async crearTurnVIP(){
		const url = this._host + this._prefix +'/store/'+this._storeTest.id+'/vipTurn';
		await axios.post(url).then(response => {
                if (response.data.done) {
                	console.log("111111111111111111");
                    console.log(response)
                } else {
                	console.log("2222222222222222");
                	console.log(response)
                }
            })
            .catch(err => {
                this.$swal('Error: ' + err)
            });
	}

	crearTurnMovil(){
		const url = this._host + this._prefix +'/store/'+this._storeTest.id+'/hourTurn';
		let formData = new FormData();
		axios.post(url, formData);
	}

	async nextTurn(){
		const url = this._host + this._prefix +'/store/'+this._storeTest.id+'/nextTurn';
		await axios.post(url).then((res) => {
				this.turn =  res.data;
			});
		return this.turn;
	}
	async getTurns(){
		const url = this._host + this._prefix +'/store/'+this._storeTest.id+'/turns';
		await axios.get(url).then((res) => {
				this.turns =  res.data;
			});
		return this.turns;
	}
	getStoreId(){
		return this._storeTest.id;
	}

}
class Client{
	constructor(mapTipusTorn, tempsAprox, divisioTemps, contador){
		console.log("nou Client");
		this._id = Client.incrementId();
		//this._tipus;				//String
		//this._segonOnAfagaTurn;		//int segons
		//this._tempsTorn;			//int segons
		
		//aquest tros de codi genera un tipus random entre els que hi ha al mapa amb la probabilitat indicada
		var max = parseInt(Object.values(mapTipusTorn[0])[0]) + parseInt(Object.values(mapTipusTorn[1])[0])+parseInt(Object.values(mapTipusTorn[2])[0]);
		var random = Math.random()*(max);
		var numAux = 0;
		var tipus;
		for (var key in mapTipusTorn) {
			
			var value = mapTipusTorn[key];	
			if((numAux < random) && (random < (numAux+Object.values(value)[0]))) tipus = Object.keys(value)[0];
			numAux += Object.values(value)[0];
		}

		//aqui genero la hora random que demana tornvalue.
		random = Math.floor((Math.random() * divisioTemps));
		var segonOnAfagaTurn = contador*divisioTemps + random;
		//aqui genero el temps que triga 
		//(la fórmula fa que com a maxim pugi trigar 50% mes i com a minim la meitat)
		random = Math.random();
		if(random > 0.5) var tempsTorn = (Math.floor(tempsAprox * random)) *60;
		else var tempsTorn = (Math.floor(tempsAprox * random) + tempsAprox) *60;
		this._torn = new Torn(tipus, segonOnAfagaTurn, tempsTorn);
	}
	/*constructor(segon){
		console.log("nou Client");
		this._id = Client.incrementId();
		this._horaDemanaTorn = segon;
		this._tempsTorn = 5;
		this._segonAtes;
	}*/
	//genera id unica
	static incrementId() {
	    if (!this.latestId) this.latestId = 1;
	    else this.latestId++;
	    return this.latestId;
	}
	getTorn(){
		return this._torn;
	}
	getHoraDemanaTorn(){
		return this._horaDemanaTorn;
	}
	getTempsTorn(){
		return this._tempsTorn;
	}
	getSegon(){
		return this._horaDemanaTorn;
	}
	getId(){
		return this._id;
	}
	
}
class Torn {	
	constructor(tipus, segonDemana, tempsTriga){
		this._id = Torn.incrementId();		//int
		this._tempsTriga = tempsTriga;		//int segon
		this._segonDemanat = segonDemana;	//int segon
		this._segonCridat = null;					//int segon
		this._segonAtes = null;					//int segon
		//si el client ja ha estat cridat
		this._demanat = false;
		this._cridat = false;				//boolean
		this._ates = false;
		this._finalitzat = false;
		this._tipus = tipus;				//String
	}

	//genera id unica
	static incrementId() {
	    if (!this.latestId) this.latestId = 1;
	    else this.latestId++;
	    return this.latestId;
	}
	getFinalitzat(){
		return this._finalitzat;
	}
	setFinalitzat(fin){
		this._finalitzat = fin;
	}
	getAtes(){
		return this._ates;
	}
	setAtes(ates){
		this._ates = ates;
	}
	getSegonFi(){
		return this._segonAtes + this._tempsTriga;
	}
	getId(){
		return this._id;
	}
	getCridat(){
		return this._cridat;
	}
	setCridat(cridat){
		this._cridat = cridat;
	}
	setSegonCridat(segon){
		this._segonCridat = segon;
	}
	getSegonCridat(){
		return this._segonCridat;
	}
	getHoraDemanaTorn(){
		return this._horaDemanaTorn;
	}
	setSegonAtes(a){
		this._segonAtes = a;
	}
	getSegonAtes(){
		return this._segonAtes;
	}
	demanarTurn(){
		this._demanat = true;
	}

	getDemanat(){
		return this._demanat;
	}
	getTempsTorn(){
		return this.__tempsTriga;
	}
	getSegonDemanat(){
		return this._segonDemanat;
	}
	getTipus(){
		return this._tipus;
	}
}

class Dependent{
	constructor(){
		this._id = Dependent.incrementId();
		this._turnAtenent = null;
		this._atenent = false;
		//Dependent._dependentsAtenent = 2;
	}
	atendreTurn(turn){
		this._turnAtenent = turn;
		this._segonFi = turn.getSegonDemanat() + turn.getTempsTorn();
		this.setAtenent(true);
	}
	getTorn(){
		return this._turnAtenent;
	}
	getAtenent(){
		return this._atenent;
	}
	setAtenent(boolean){
		this._atenent = boolean;
	}
	setTurnAtenent(turn){
		this._turnAtenent = turn;
	}
	setSegonFi(segon){
		this._segonFi = segon;
	}
	getSegonFi(){
		return this._segonFi;
	}
	getId(){
		return this._id;
	}
	//genera id unica
	static incrementId() {
	    if (!this.latestId) this.latestId = 1;
	    else this.latestId++;
	    return this.latestId;
	}
}


export class ManagerTurns{
	constructor(horaInicial, horaFinal, dependents, divId, arrayNumClientsPerBucket, arrayTempsClientPerBucket, mapTipusTorn, nomTest){
		this._dependentsTotals = dependents; 				//int
		this._horaInicial = horaInicial;					//data		
		this._horaFinal = horaFinal;						//data
		//this._segonFinal = ((horaFinal-horaInicial)/1000);	//int
		this._segonFinal = (horaFinal.slice(0, horaFinal.search(":"))-horaInicial.slice(0, horaInicial.search(":")))*3600 + (horaFinal.slice(horaFinal.search(":")+1, horaFinal.length)-horaInicial.slice(horaInicial.search(":")+1, horaInicial.length));	//int
		this._mapTipusTorn = mapTipusTorn;					//map<String,int> nom, percentatje
		this._divisioTemps = this._segonFinal/arrayNumClientsPerBucket.length;			//int segons de la divisio de temps
		this._divId = divId;

		this._arrayNumClientsPerBucket = arrayNumClientsPerBucket; 	//array<int> quantitat clietns
		this._arrayTempsClientPerBucket = arrayTempsClientPerBucket; //array<int> segons

		this._arrayTornsDemanats = [];						//array<Torn>
		this._arrayTornsCridats = [];						//array<Torn>
		this._arrayDependents = [];							//array<Depenent>
		this._arrayClients = [];							//array<Client>
		this._segonActual = 0;								//int
		this._nomTest = nomTest;							//String

		this._BD = new DBManager(nomTest);
		for(var i = 0; i< this._dependentsTotals; i++){
			this._arrayDependents.push(new Dependent());
		}
	}
	async crearTest(){
		//console.log("->>>>>>>>>>>>> "+ await this._BD.crearTest());
		if(await this._BD.crearStore()){
			return true;
		} 
		return false;
		//return this._BD.crearTest();
	}
	//funcio copiada que espera durant ms milisegons
	async sleep(ms){
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	async start(){
		
		this._arrayClients = this.generateClients(this._segonFinal);
		for(var i = 0; i<this._segonFinal;i++){
				//this._arrayClients.sort(this.comparar);
				//aquest bucle serveix per posar tots els torns demanats en el segon actual al array de torns
				var arrayTornsDemanantTurnAra = this.getClientsDemanantTornAra(i);
				for(var k = 0; k < arrayTornsDemanantTurnAra.length ; k++){
					//quan el turn es demana es posa a la bd
					console.log(arrayTornsDemanantTurnAra[k]);
					await this.afegirTornBD(arrayTornsDemanantTurnAra[k]);
					arrayTornsDemanantTurnAra[k].demanarTurn();
					this._arrayTornsDemanats.push(arrayTornsDemanantTurnAra[k]);
				}
					
				//await this._BD.nextTurn();
				
							//es criden als clients per dir que casi els toca
				while(this.getTornsCridats() < this._dependentsTotals && this.getTornsDemanats().length > 0){
					this.cridarSeguentTorn(i);
				}

				//s'ordena per prioritat els torns
				//arrayTornsActual.ordenarPerPrioritat;

				//per cada dependent lliure es criden els clients
				while(this.getDependentsAtenent() < this._dependentsTotals && this.getTornsCridats().length > 0){
					var depenent = this.getDependentLliure();
					//aqui afago el torn seguent de la bd
					//let turnAux = this._BD.nextTurn();
					await this._BD.nextTurn();

					this._arrayTornsCridats = this.ordenarTurns(this.getTornsCridats());
					depenent.atendreTurn(this._arrayTornsCridats[0]);
					console.log("es crida al torn: " +depenent.getTorn().getId());
					this._arrayTornsCridats[0].setSegonAtes(i);
					this._arrayTornsCridats[0].setAtes(true);
				}
				
				//despres els clients que han acabat deixen el depenent lliure
				for(var index = 0; index < this._arrayDependents.length; index++){
					if(this._arrayDependents[index].getAtenent() === true && this._arrayDependents[index].getTorn().getSegonFi() === i){
						this._arrayDependents[index].setAtenent(false);
						this._arrayDependents[index].getTorn().setFinalitzat(true);
						console.log("El torn ha acabat: " +this._arrayDependents[index].getTorn().getId());
					}
				}

				//bucle on s'han de cridar als clients per a que estiguin preparats

				/*	*/
				//this.paint();
				//await this.sleep(0.001);
				if(i%3600 === 0) {
					console.log("Hora : "+ Math.floor(i/3600));
				}
		}
		console.log("---------->HA ACABAT<-------------");
		console.log(this._arrayClients);
		console.log(this._arrayTornsDemanats);
	}
	comparar(a, b){
		return a.getSegonDemanat() - b.getSegonDemanat();
	}
	
	ordenarTurns(auxiliar){
		var anterior = null;
		for(var i = 0;i < auxiliar.length -1; i++){
			for(var j = 1; j < auxiliar.length - i; j++){
				if(auxiliar[j-1].getTipus === "vip"){
					if(auxiliar[j].getTipus === "vip" && auxiliar[j-1].getSegonDemanat > auxiliar[j].getSegonDemanat){
						var temp = auxiliar[j-1];
						auxiliar[j-1] = auxiliar[j];
						auxiliar[j] = temp;
					}
				} else if(auxiliar[j].getTipus === "vip"){
					var temp = auxiliar[j-1];
					auxiliar[j-1] = auxiliar[j];
					auxiliar[j] = temp;
				}else if(auxiliar[j-1].getSegonDemanat > auxiliar[j].getSegonDemanat){
					var temp = auxiliar[j-1];
					auxiliar[j-1] = auxiliar[j];
					auxiliar[j] = temp;
				}
			}
		}
		return auxiliar;
	}
	cridarSeguentTorn(segon){
		var aux = this.ordenarTurns(this.getTornsDemanats());
		aux[0].setCridat(true);
		aux[0].setSegonCridat(segon);
	}

	getTornsCridats(){ 	//array<Torn>
		var arrayTorns = [];
		for(var index in this._arrayTornsDemanats){
			var torn = this._arrayTornsDemanats[index];
			if(torn.getCridat() && !torn.getAtes()) arrayTorns.push(torn);
		}
		return arrayTorns;
	}

	getTornsDemanats(){//array<Torn>
		var arrayTorns = [];
		for(var index in this._arrayTornsDemanats){
			var torn = this._arrayTornsDemanats[index];
			if(torn.getDemanat() && !torn.getCridat()) arrayTorns.push(torn);
		}
		return arrayTorns;
	}

	getSeguentTornCridat(){
		for(var index in this._arrayTornsDemanats){
			var torn = this._arrayTornsDemanats[index];
			if(torn.getCridat() && !torn.getFinalitzat()) return torn;
		}
	}
	getClientsDemanantTornAra(segon){ 	//array<Torn>
		var toReturn = [];
		for (var i = this._arrayClients.length - 1; i >= 0; i--) {
			if(this._arrayClients[i].getTorn().getSegonDemanat() === segon) toReturn.push(this._arrayClients[i].getTorn());
		}
		return toReturn;
	}

	getDependentLliure(){	//Dependent
		for(var index in this._arrayDependents){
			var depenent = this._arrayDependents[index];
			if(!depenent.getAtenent()){
  				return depenent;
  			} 
		}
		/*this._arrayDependents.forEach(function(depenent) {
  			if(!depenent.getAtenent()){
  				toReturn = depenent;
  				return depenent;
  			} 
		});
		return toReturn;*/
			
	}
	getDependentsAtenent(){
		var cont = 0;
		this._arrayDependents.forEach(function(depenent) {
  			if(depenent.getAtenent()) cont++;
		});
		return cont;
	}

	//genera clients random en funcio del array de temps
	generateClients(){
		var contador = 0;
		var arrayClients = [];
		for(var index in this._arrayNumClientsPerBucket){
			var numClients = this._arrayNumClientsPerBucket[index];
			for (var i = 0; i < numClients; i++) {
				var c = new Client(this._mapTipusTorn, this._arrayTempsClientPerBucket[contador], this._divisioTemps, contador);	
				arrayClients.push(c);
				//console.log(arrayClients + " " + numClients);
			}
			contador++;
		}

		this._arrayClients = arrayClients;
		return arrayClients;
	}

	async afegirTornBD(torn){
		console.log(torn.getTipus());
		if(torn.getTipus() === "normal"){
			await this._BD.crearTurnNormal();
		}
		else if(torn.getTipus() === "vip"){
			await this._BD.crearTurnVIP();
		}
		else if(torn.getTipus() === "movil"){
			await this._BD.crearTurnMovil();
		}
	}
	getTipusTornsAcabats(){
		var vip = 0, normal = 0, movil = 0;
		for(var index in this._arrayTornsDemanats){
			var torn = this._arrayTornsDemanats[index];
			if(torn.getTipus() === "vip") vip++;
			else if(torn.getTipus() === "normal") normal++;
			else movil++;
		}
		return [normal,vip,movil];
	}
	getNumTornsAtesosHora(){
		var hores = this._arrayTempsClientPerBucket.length;
		var temps = this._segonFinal/hores;
		var numTornsAtesosHora = [];
		for(var i = 0; i < hores; i++){
			numTornsAtesosHora.push(0);
		}
		for(var index in this._arrayTornsDemanats){
			var torn = this._arrayTornsDemanats[index];
			
			for(var i = 0; i < hores; i++){
				if(torn.getSegonAtes() < temps*(i+1) && torn.getSegonAtes() > temps*i){
					numTornsAtesosHora[i]++;
				}
			}
		}
		return numTornsAtesosHora;
	}
	getNumTornsDemanantHora(){
		var hores = this._arrayTempsClientPerBucket.length;
		var temps = this._segonFinal/hores;
		var numTornsAtesosHora = [];
		for(var i = 0; i < hores; i++){
			numTornsAtesosHora.push(0);
		}
		for(var index in this._arrayTornsDemanats){
			var torn = this._arrayTornsDemanats[index];
			
			for(var i = 0; i < hores; i++){
				if(torn.getSegonDemanat() < temps*(i+1) && torn.getSegonDemanat() > temps*i){
					numTornsAtesosHora[i]++;
				}
			}
		}
		return numTornsAtesosHora;
	}
	getStoreId(){
		return this._BD.getStoreId();
	}
	paint(){
		var div = document.getElementById(this._divId);
		//div.setText("hola");
	}
}