import React, { Component } from 'react';
import './App.css';
import {ManagerTurns} from "./clases/funcions";
import Chart from "chart.js";
import { Doughnut, Line } from 'react-chartjs-2';
import CrazyDataLineExample from './assets/components/crazyLine';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //cantitat clients hora
      cantClientsHour : [2,3,7,8,7,5,5,6,11,8,10,5],
      //temps dels clients
      tempsClientsHour : [5,5,5,5,5,5,5,5,5,5,5,1],
      nomTest : "Nom test",
      depenents: 1,
      horaObertura: "09:00",
      horaTancament: "21:00",
      maxClientsPerHora : 100,
      tempsMaximClient:20,
      tempsBucket : "00:10",
      proporcioNormal : 10,
      proporcioVIP : 2,
      proporcioMovil : 0,
      grafiques : false,
      manager : [],
      tipus: [1,1,1],
      tornsAtesosHora: [],
      tornsEsperantHora: [],
      storeId : "",
    };
  }

  handleCheckbox(e) {
    const { name, text } = e.target;
    this.setState({
      [name]: text
    });
  }
  async generar(){
    var arrayClients = this.state.cantClientsHour;
    var arrayTempsClients = this.state.tempsClientsHour;
    var proporcioClients = [{"normal":this.state.proporcioNormal}, {"movil":this.state.proporcioMovil}, {"vip":this.state.proporcioVIP}];
    this.state.manager = new ManagerTurns(this.state.horaObertura, this.state.horaTancament, this.state.depenents, null, arrayClients, arrayTempsClients, proporcioClients, this.state.nomTest);
    console.log(this.state.manager);
    if(await this.state.manager.crearTest() === true){
      console.log("START");
      this.state.storeId = this.state.manager.getStoreId();
      await this.state.manager.start();
      this.state.tipus = this.state.manager.getTipusTornsAcabats();
      this.state.tornsAtesosHora = this.state.manager.getNumTornsAtesosHora();
      this.state.tornsEsperantHora = this.state.manager.getNumTornsDemanantHora();
    }
    else{
      console.log("NO START");
    }
    this.setState({
      grafiques : true
    })
    this.render();
  }
handleChange(i, e) {
    this.setState({
      cantClientsHour: { ...this.state.cantClientsHour, [i]: e.target.value }
    });
  }
handleChangeTemps(i, e) {
    this.setState({
      tempsClientsHour: { ...this.state.tempsClientsHour, [i]: e.target.value }
    });
  }

  render() {


    var items1 = [];
    for (var i = 0; i <= 9; i++) {
       items1.push(
        <div className="col" key={i}> {i+9}-{i+10} <br/>
                <div className="slider-container" key={i}></div> 
                  <input
                    type="number"
                    min="0"
                    max={this.state.maxClientsPerHora}
                     style={{ width: 35 }}
                    value={this.state.cantClientsHour[i]} 
                    onChange={this.handleChange.bind(this, i)} />
          
        </div>);
    }
    //
    var items2 = [];
    for (var i = 0; i <= 9; i++) {
       items2.push(
       <div className="slider-container" key={i}>
         <input
           className="slider"
           id="vertical"
           type="range"
           min="0"
           max={this.state.maxClientsPerHora}
           value={this.state.cantClientsHour[i]} 
           onChange={this.handleChange.bind(this, i)} />
        </div>
      );
    }
    var items3 = [];
    for (var i = 0; i <= 9; i++) {
       items3.push(
        <div className="col" key={i}>
        {i+9}-{i+10} <br/>
          <input
            type="number"
            min="0"
            max= {this.state.tempsMaximClient}
            style={{ width: 35 }}
            value={this.state.tempsClientsHour[i]} 
            onChange={this.handleChangeTemps.bind(this, i)} />
        </div>
      );
    }
    var items4 = [];
    for (var i = 0; i <= 9; i++) {
      items4.push(<div className="slider-container" key={i}>
                          <input
                            className="slider"
                            id="vertical"
                            type="range"
                            min="0"
                            max={this.state.tempsMaximClient}
                            value={this.state.tempsClientsHour[i]}
                            onChange={this.handleChangeTemps.bind(this, i)}
                          />
                          </div>);
    }



    if(this.state.grafiques){
      const data = {
        labels: [
          'Normal',
          'Vip',
          'Mobil'
        ],
        datasets: [{
          data: this.state.tipus,
          backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
          ],
          hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
          ]
        }]
      };

      const data1 = {
        labels: ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'],
        datasets: [
          {
            label: 'torns Atesos Hora',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.state.tornsAtesosHora
          }, {
            label: 'Torns demanats',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#EC932F)',
            borderColor: '#EC932F)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: '#EC932F',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#EC932F',
            pointHoverBorderColor: '#EC932F',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.state.tornsEsperantHora
          }
        ]
      };



      return (    
        <div style = {{flex: 1}}>  
            <h2>Tipus de torns</h2>
           <Doughnut data={data} />
           <h2>Torns per hora</h2>
            <Line data={data1} />
            <h2>Exemple</h2>
            <CrazyDataLineExample id={this.state.testId}/>
            
        </div>
      );
    }
    else{
      return (
        <div>
          <div className="container" style={{marginTop: 20}}>
            <section>
              <header>
                <div className="row">
                  <div className="col">
                    <h1 className=" terminal-prompt">

                    </h1>
                  </div>
                </div>
              </header>
              <div className="input-container">
                <input
                  id="input"
                  className={this.state.theme}
                  name="password"
                  type="text"
                  readOnly
                  value={this.state.pwd}
                />
              </div>
            </section>
            <hr />
            <section>
              <header>
                <h3>Dades de la simulacio</h3>
              </header>
              <fieldset>
                <div className="row">
                  <div className="col">
                    <div className="form-group">

                     <label>
                        <div className="row">
                          <div className="col">
                            Nom Test
                          </div>
                          <div className ="col">
                            <input
                              type="text" 
                              value={this.state.nomTest}
                              name="nomTest"
                              onChange={e => {
                                this.setState({ nomTest: e.target.value });
                              }}
                            />
                          </div>
                        </div>
                      </label>

                      <label>
                        <div className="row">
                          <div className="col">
                            Proporcio de turns normals  
                          </div>
                          <div className="col">  
                              <input
                                type="number"
                                min="0"
                                max= "100"
                                style={{ width: 35 }}
                                value={this.state.proporcioNormal}
                                onChange={e => {
                                  this.setState({ proporcioNormal :  e.target.value });
                                }}
                              />
                          </div>
                          <div className ="col">
                            <input
                              type="range" 
                              value={this.state.proporcioNormal}
                              name="proporcioNormal"
                              className="sliderNormal"
                              onChange={e => {
                                this.setState({ proporcioNormal: e.target.value });
                              }}
                            />
                          </div>
                        </div>
                      </label>
                      <label>
                        <div className="row">
                          <div className="col">
                            Proporcio de turns movil
                          </div>
                           <div className="col">  
                              <input
                                type="number"
                                min="0"
                                max= "100"
                                style={{ width: 35 }}
                                value={this.state.proporcioMovil}
                                onChange={e => {
                                  this.setState({ proporcioMovil :  e.target.value });
                                }}
                              />
                          </div>
                          <div className ="col">
                            <input
                              type="range" 
                              value={this.state.proporcioMovil}
                              name="proporcioMovil"
                              className="sliderNormal"
                              onChange={e => {
                                this.setState({ proporcioMovil: e.target.value });
                              }}
                            />
                          </div>
                        </div>
                      </label>
                      <label>
                        <div className="row">
                          <div className="col">
                            Proporcio de turns VIP
                          </div>
                           <div className="col">  
                              <input
                                type="number"
                                min="0"
                                max= "100"
                                style={{ width: 35 }}
                                value={this.state.proporcioVIP}
                                onChange={e => {
                                  this.setState({ proporcioVIP :  e.target.value });
                                }}
                              />
                          </div>
                          <div className ="col">
                            <input
                              type="range"
                              className="sliderNormal" 
                              value={this.state.proporcioVIP}
                              name="proporcioVIP"
                              onChange={e => {
                                this.setState({ proporcioVIP: e.target.value });
                              }}
                            />
                          </div>
                        </div>
                      </label>

                      <label>
                        <div className="row">
                          <div className="col">
                            Hora obertura
                          </div>
                          <div className ="col">
                            <input
                              type="time" 
                              value={this.state.horaObertura}
                              name="horaObertura"
                              onChange={e => {
                                this.setState({ horaObertura: e.target.value });
                              }}
                            />
                          </div>
                          <div className ="col"></div>
                        </div>
                      </label>
                      <label>
                       <div className="row">
                          <div className="col">
                            Hora tancament
                          </div>
                          <div className ="col">
                            <input
                              type="time" 
                              value={this.state.horaTancament}
                              name="horaTancament"
                              onChange={e => {
                                this.setState({ horaTancament: e.target.value });
                              }}
                            />
                          </div>
                          <div className ="col"></div>
                        </div>
                      </label>
                      <label>
                        <div className="row">
                          <div className="col">
                            Temps Bucket
                          </div>
                          <div className ="col">
                            <input
                              type="time"
                              value={this.state.tempsBucket}
                              name="tempsMobil"
                              onChange={e => {
                                this.setState({ tempsBucket: e.target.value });
                              }}
                            />
                          </div>
                          <div className ="col"></div>
                        </div>
                      </label>
                      <label>
                        <div className="row">
                          <div className="col">
                           Depenents atenent
                          </div>
                          <div className ="col">
                            <input
                              type="number" 
                              min="1"
                              max = "5"
                              value={this.state.depenents}
                              name="depenents"
                              onChange={e => {
                                this.setState({ depenents: e.target.value });
                              }}
                            />
                          </div>
                          <div className ="col"></div>
                        </div>
                      </label>
                  <div className="col">
                    <h2>Clients en cada hora</h2>
                    <div className="form-group">                  
                       <div className="row">
                         {items1}
                        </div>              
                      <div className="row">
                        {items2}                       
                        </div>
                    </div>
                  </div>
                  <div className="col">
                    <h2>Temps dels clients</h2>
                    <div className="form-group">
                      <div className="row">                       
                       {items3}                      
                      </div>
                      <div className="row">                        
                         {items4}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                </div>
              </fieldset>
              <br />
              <div style={{ textAlign: "left" }}>
                <div className="row">
                  <div className="col">
                    <button
                      className="btn  btn-primary"
                      onClick={() => {
                        this.generar();
                      }}
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <br />
                <br />
              </div>
            </section>
            <div
              style={{
                textAlign: "center"
              }}
            >
            </div>
          </div>
        </div>
      );
    }
  }
}

export default App;

