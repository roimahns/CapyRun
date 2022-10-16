import pinetree from "./pinetree2.jpg";
function App() {
  return (
    <div className="App">
      <h1 className="Title">CapyRun!</h1>
      <i className="creater">Made By: Roi Mahns</i>


      <br></br><br></br><br></br><br></br><br></br>


      <button class="button">PLAY</button>
      <div> <img src={pinetree} className="pinetree2" alt = "pinetree"></img>
      </div>

    </div>


  );
}


export default App;
