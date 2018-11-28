import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import DeletedMessage from './DeletedMessage';
import qs from 'qs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label
} from 'recharts';
import { Link } from 'react-router';


class App extends Component {
  constructor() {
    super();
    this.state = {
      name:'',
      sensor1alldata: [],
      errors: '',
      showDeletedMessage: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


  dofilter(inarray) {
    var array = [];
    var i = 0;
    inarray.forEach(obj => {
      array.push({
        seq: ++i,
        name:obj.name,
        ability1: obj.ability1,
        ability2: obj.ability2,
        pokeindex: obj.pokeindex,
        pokeimage: obj.pokeimage,
        ImgPath: ''
      });
    });
    this.setState({ sensor1alldata: array });
    
  }
  
  onChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }


  onSubmit(e){
    e.preventDefault();
    axios.post(`https://desolate-lowlands-21073.herokuapp.com/findpokemon/?name=${this.state.name}`)
    .then((result) =>{

    })
    .catch((err)=>{
      console.log(err);
    })
  }

  componentDidMount() {
    setInterval(() => {
      axios
        .get('https://desolate-lowlands-21073.herokuapp.com/history')
        .then(result => {
          this.dofilter(result.data);
          console.log(result.data);
        })
        .catch(err => {
          this.setState({ errors: err.response.data });
        });
    }, 300);
  }

  deleteAllHandler = () => {
    axios
      .get('https://desolate-lowlands-21073.herokuapp.com/deleteall')
      .then(result => {
        this.setState({ showDeletedMessage: true });
      })
      .catch(err => {
        console.log('unable to delete: ', err);
      });
  };

  alertDismissHandler = () => {
    this.setState({ showDeletedMessage: false });
  };


  render() {
    var {sensor1alldata } = this.state;
    sensor1alldata = sensor1alldata.map((row) => {
      row.ImgPath = row.pokeimage;
      return row;
    });
    return (
          <div>
            <h1 className="header p fontstyle wallpaper">PokéDex</h1>
             <form onSubmit={this.onSubmit}>
             <div className="form-group col-sm-1">
             <label htmlFor="name">Enter Pokémon Name or Index : </label>
             </div>
             
               <div className="form-group col-sm-2">
                
                 <input id="name" name="name" className="form-control" type="text" placeholder="Pokemon Name or ID..." value={this.state.name}
                 onChange={this.onChange}/>
               </div>
               <div className="form-group col-sm-4">
               <input className="btn btn-success" type="submit" value="Send"/>
               
               </div>
             </form>
        <div className="container col-sm-12">
          <DeletedMessage
            show={this.state.showDeletedMessage}
            alertDismiss={this.alertDismissHandler}
          />
          <div className="row">
            <div className="text-center container col-sm-12">
              <div className="row">
                <div className="text-center container col-sm-1">
                  <div id="deleteall">
                    <br />
                    <button
                      className="btn btn-danger btn-xs"
                      onClick={this.deleteAllHandler}
                    >
                      <h4>Delete all data</h4>
                    </button>
                  </div>
                </div>

              </div>
              <div>
                <label/>
              </div>
              <div className="row col-sm-12">
                <div className="sensortable">
                  <label>
                    <h3 className="w3-blue o header2">Search History</h3>
                  </label>
                  <br />
                  <div>
                    <ReactTable
                      data={this.state.sensor1alldata}

                      columns={[
                        {
                          Header: 'Sequence',
                          accessor: 'seq'
                        },
                        {
                          Header: 'Name',
                          accessor: 'name'
                        },
                        {
                          Header: 'Ability',
                          accessor: 'ability1'
                        },
                        {
                          Header: 'Ability',
                          accessor: 'ability2'
                        },
                        {
                          Header: 'Poké Index',
                          accessor: 'pokeindex'
                        },
                        {
                          Header: 'Poké Image',
                          accessor: 'pokeimage',
                          Cell: (row) => {
                            return <div><img height={35} src={row.original.ImgPath}/></div>
                          },
                        }
                      ]}
                      defaultPageSize={10}
                      className="-striped -highlight"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;