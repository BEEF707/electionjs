const https = require('https');

//Get function from an aPI
//@param url (string) address to get aPI request
//@param token (string) aPI token for authentication
//@returns (Promise) that is data from the aPI (the result of the get)
function getWithBearerToken(url, token) {

    const options = {
        headers: {
            Authorization: `Bearer ${token}`  //These are forward ticks, not quotes!
        }
    }; //End Setting our headers...
                                      
    return new Promise((resolve, reject) => {
        const req = https.get(url, options, res => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });
                                                                                                                    
        req.on('error', error => {
            reject(error);
        });
                                                                                                                                          
        req.end();
    }); //end the Promise
} //End the getWithBearerToken function
   

// Sending information (POST) to an aPI
// @param url (string) address to send information
// @param token (string) authentication to access aPI
// @param data (Object) the information to send to the aPI
// @returns (Promise) results of POST request
function postWithBearerToken(url,token,data){

    const options = {
        method:"POST",
        headers: {
            Authorization: `Bearer ${token}` , //These are forward ticks, not quotes!
            "content-type": "application/json"
            // Will we need content type?
        }
    }; //End Setting our headers...

    return new Promise((resolve,reject) => {
        const req=https.request(url,options,res=>{
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });
                                                                                       
        req.on('error', error => {
            reject(error);
        });
                                                                                                                                                                                                                                                                                                                                
        req.write(JSON.stringify(data));
        req.end();
    })//End Promise
}//End postWithBearerToken function

// Update information (PUT) to an aPI
// @param url (string) address to send information
// @param token (string) authentication to access aPI
// @param data (Object) the information to send to the aPI
// @returns (Promise) results of PUT request
function putWithBearerToken(url,token,data){

    const options = {
        method:"PUT",
        headers: {
            Authorization: `Bearer ${token}` , //These are forward ticks, not quotes!
            "content-type": "application/json"
            // Will we need content type?
        }
    }; //End Setting our headers...

    return new Promise((resolve,reject) => {
        const req=https.request(url,options,res=>{
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });
                                                                                       
        req.on('error', error => {
            reject(error);
        });
                                                                                                                                                                                                                                                                                                                                
        req.write(JSON.stringify(data));
        req.end();
    })//End Promise
}//End putWithBearerToken function

module.exports = {
    getWithBearerToken,
    postWithBearerToken,
    putWithBearerToken
}; 