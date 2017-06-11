connection.query("sunshine");
  var strQuery = "select * from user";    
  
  connection.query( strQuery, function(err, rows){
      if(err)    {
          throw err;
      }else{
          console.log( rows );
      }
  });