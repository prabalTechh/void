export function random(len:number){
    let options = "asjdlvkasdpivhaoifazldhvihaoyaxc1234567890";
    let length = options.length;

    let ans = "";

    for(let i = 0 ; i< len ; i++){
        ans = ans + options[Math.floor((Math.random() * length))];

    }
    return ans;
}