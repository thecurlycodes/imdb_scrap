const request=require('request');
const cheerio=require('cheerio');
const fs=require('fs');

const URL="https://www.imdb.com/search/title/?count=2&groups=top_1000&sort=user_rating";

let moviesList=[];
request(URL,(error,response,html)=>{
    if(!error && response.statusCode==200){
        const $=cheerio.load(html);

        $('.lister-item').each((i,el)=>{
            let obj={};
            obj.image=$(el).find('.lister-item-image').find('img').attr('loadlate');
            //console.log(obj.image)
            obj.name=$(el).find('.lister-item-header').find('a').text();
            obj.year=$(el).find('.lister-item-header').find('.lister-item-year').text();
            //console.log(obj.name,obj.year)
            obj.duration=$(el).find('.text-muted ').find('.runtime').text();
            obj.genre=$(el).find('.text-muted ').find('.genre').text().trim();
            //console.log(obj.duration,obj.genre)
            obj.ratings=$(el).find('.ratings-bar ').find('.ratings-imdb-rating').attr('data-value');
            //console.log(obj.ratings)

            const spans=$(el).find('.sort-num_votes-visible').find('span');
            spans.each((i,ele)=>{
                if($(ele).attr("name")=="nv"){
                    if(i==1){
                        obj.votes=$(ele).text();
                    }
                    if(i==4){
                        obj.gross=$(ele).text();
                    }  
                }
            });
            moviesList.push(obj);
        });

        fs.writeFile("movies.json",JSON.stringify(moviesList),function(error){
            if(error) throw error;
            console.log("Completed");
        })
    }
})
