interface Car {
    make: string;
    color: string;
    registration: string;
    owner: string;
  }
  
  interface Bicycle {
    make: string;
    color: string;
    owner: string;
  }
  
  type Transporter = Car | Bicycle;
  
  const database: Transporter[] = [
   {   // Car
      make: "Toyota Yaris",
      color: "Red",
      registration: "231WD1234",
      owner: "Jane Smith",
   },
   {    // Car
      make: "Suzuki Swift",
      color: "Blue",
      registration: "241WD4321",
      owner: "Paul O Regan",
   },
   {   // Car
      make: "Ford Puma",
      color: "Blue",
      registration: "241WD1212",
      owner: "Eileen Silk",
   },
   {   // Bicycle
      make: "Revel Rascal XO",
      color: "Blue",
      owner: "Cindy Tamoka",
   },
   {    // Bicycle
      make: "Yeti SB140 LR",
      color: "Red",
      owner: " ",
   },
  ];



  function getMatches(database:Transporter, car:Car,bike:Bicycle) {

   let answer = []
   for(let i in database)
   {
      if(i.color === "Blue")
      {
         answer[i]
      }
      else if( i.color === "Red" && "registration" in t)
      {
         answer[i]
      }
   }

   for(let j in answer)
      {
         print(j.toString)
      }   

  }


  
  getMatches((t) => t.color === "Blue")
  getMatches((t) => t.color === "Red" && "registration" in t)