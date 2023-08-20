import React, { useEffect, useState } from 'react';
import { Col, Row } from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion';
import { vogue_trending } from "../../apis/fashiontrends";

function FashionTrends(props) {

    const [trends, setTrends] = useState({});
    const [trendsCount, setCount] = useState(0);
    const [trendsSitesCount, setSitesCount] = useState(0);
    useEffect(() =>{
        vogue_trending().then((response)=>
            {
                setSitesCount(Object.keys(response.data).length)
                setTrends(response.data)
                let total = 0
                Object.values(response.data).forEach(detail => {
                    total = total + detail.data.length;
                    }
                )
                setCount(total)

            }

        )
    },[])
    return (
        <div style={{ marginLeft: '5vw' }}>
            <Row className="bg-white rounded-xl h-auto shadow-lg p-6 my-6">
                <h1 style={{ textAlign: "center", fontSize: '4vh', fontWeight: 'Bold' }}>
                    <span className="text-primary-blue"> Fashion</span><span style={{ color: "#ffc107" }}> Trends</span>
                </h1>

            </Row>
            <Row className="my-6">
                <Col className="text-white bg-primary-blue rounded-xl h-auto shadow-lg p-6 mr-6"
                     style={{ fontSize: '2vh' }}>
                    <Row>
                        <Col>
                            Products Scraped:
                        </Col>
                        <Col>
                            {trendsCount}
                        </Col>
                    </Row>

                </Col>
                <Col className="rounded-xl h-auto shadow-lg p-6 ml-6"
                     style={{ color: '#FFFFFF', background: "#ffc107", fontSize: '2vh' }}>
                    <Row>
                        <Col>
                            No of Sites Scraped:
                        </Col>
                        <Col>
                            {trendsSitesCount}
                        </Col>
                    </Row>

                </Col>
            </Row>
            <Row className="bg-white rounded-xl h-auto shadow-lg p-6">
                <Accordion>
                    {

                        Object.keys(trends).map((key) => {
                            return(
                                <Accordion.Item eventKey={key}>
                                    <Accordion.Header><h2 style={styles.accordionHeading}>{key}</h2> <i
                                        style={styles.lastScraped}> Last Scraped : {trends[key].last_scraped}  </i></Accordion.Header>
                                    <Accordion.Body>
                                        <Row >
                                        {trends[key].data.map((data) =>
                                        {
                                            return(
                                                <Col sm={4}>
                                                    <img src={data}/>
                                                </Col>
                                                )

                                        })
                                        }
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )
                        })
                    }


                </Accordion>

            </Row>
        </div>

    );
}

const styles = {

    accordionHeading: {
        fontSize: '3vh',
        color: '#1a232e',
    },
    lastScraped: {
        marginLeft: '10vh',
        color: '#989898',
        fontSize: '2vh',
    }
}

export default FashionTrends;
