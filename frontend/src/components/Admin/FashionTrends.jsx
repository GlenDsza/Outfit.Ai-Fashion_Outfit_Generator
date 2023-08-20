import React, { useEffect, useState } from 'react';
import { Col, Row } from "react-bootstrap";
import { vogue_trending } from "../../apis/fashiontrends";

function FashionTrends(props) {

    const [trends, setTrends] = useState([]);
    const [trendsCount, setCount] = useState( 0 );
    const [trendsLastFetched, setLastFetched] = useState();
    useEffect(() =>{
        vogue_trending().then((response)=>
            {
                setLastFetched(response.last_fetched);
                console.log(response)
                setCount(response.data.length)
                setTrends(response.data)
            }

        )
    },[])
    return (
        <div style={{marginLeft: '5vw'}}>
            <Row className="bg-white rounded-xl h-auto shadow-lg p-6 my-6" >
                <h1 style={{textAlign:"center", fontSize:'4vh', fontWeight:'Bold'}}>
                    <span className="text-primary-blue"> Fashion</span><span style={{color:"#ffc107"}}> Trends</span>
                </h1>

            </Row>
            <Row className="my-6">
                <Col className="text-white bg-primary-blue rounded-xl h-auto shadow-lg p-6 mr-6" style={{fontSize:'2vh'}}>
                    <Row>
                        <Col>
                            Products Scraped:
                        </Col>
                        <Col>
                            {trendsCount}
                        </Col>
                    </Row>

                </Col>
                <Col className="rounded-xl h-auto shadow-lg p-6 ml-6" style={{color:'#FFFFFF', background:"#ffc107",fontSize:'2vh'}}>
                    Last Scraped: {trendsLastFetched}
                </Col>
            </Row>
            <Row className="bg-white rounded-xl h-auto shadow-lg p-6">
                {
                    trends.map((data)=>
                    {
                        return(
                                <Col sm={4}>
                                    <img src={data.imgsrc} alt={data.heading}/>
                                </Col>
                            )

                    })
                }

            </Row>
        </div>

    );
}

export default FashionTrends;
