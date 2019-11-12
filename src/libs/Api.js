class Api {

    // DEV API
    static host = 'http://192.168.100.5:8001';
    // PROD API
    // static host = 'https://api.envisions.app/api/';

    static headers(){
        return{
            'Accept': 'application/json, text/plain, text/json, text/html',
            'Content-Type': 'application/json',
            // 'apikey': 'bb9d3e49a26fe25a66022f9379d93e9b8b400b48',
            // 'dataType': 'json',
            // 'X-Mashape-Key':,
        }
    }

    static get(route){
        return this.xhr(route, null, 'GET');
    }

    static put(route, params){
        return this.xhr(route, params, 'PUT');
    }

    static post(route, params){
        return this.xhr(route, params, 'POST');
    }

    static delete(route, params){
        return this.xhr(route, params, 'DELETE');
    }

  
    static xhr(route, params, verb){

        const url = this.host + route;

        let options = Object.assign({method: verb}, params ? {body: JSON.stringify(params)} : null);

        options.headers = Api.headers();

        return fetch(url, options).then( resp => {
            
            let json = resp.json();

            if(resp.ok){
                return json;
            }
            
        })
    }
}

export default Api;