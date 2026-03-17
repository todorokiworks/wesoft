
import '../css/subpage.less'
import React, { useEffect, useState } from 'react';
import { Carousel, Divider, Space } from "antd";
import SkeletonView from '../common/SkeletonView';
import * as BusinessEntity from '../entities/Business';


const Business: React.FC = () => {
    const [items, setEvents] = useState<BusinessEntity.Business[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const timestamp = new Date().getTime();
        fetch(`/data/business.json?t=${timestamp}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <SkeletonView />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div className='subpage business'>
            <Carousel autoplay arrows >
                {items.map(item => {
                    const dynamicContentStyle = {
                        height: '300px',
                        width: '100vw',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        justifyContent: 'center',
                        padding: "4px",
                        backgroundImage: `url(${item.coverUrl})`,

                    };
                    return (item.coverUrl &&
                        < >
                            <Space style={dynamicContentStyle} align="center">
                                <Space direction="vertical" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", minWidth: "100px", padding: "10px", textAlign: "center", borderRadius: "10px" }}>
                                    <h3>{item.title}</h3>
                                    <p>{item.subTitle}</p>
                                </Space>
                            </Space>
                        </>
                    );
                })}
            </Carousel>
            <Space direction="vertical" style={{ width: '100%' }} align="center" wrap>
                <Space direction="vertical" className='main' wrap>
                    {items.map(item => (
                        <div id={"content" + item.id} >
                            <h2>{item.title} </h2>
                            <Divider />
                            {item.description && <p style={{ color: '#333' }}>{item.description}</p>}
                            {item.contents && item.contents.map(content => (
                                <>
                                    {content.title &&
                                        <h4 style={{ color: '#333' }}>{content.title}</h4>
                                    }

                                    {content.description &&
                                        <p style={{ color: '#333' }}>{content.description}</p>
                                    }
                                    {content.list &&
                                        <ul style={{ color: '#333' }}>
                                            {content.list.map(requirement => (
                                                <li>{requirement}</li>
                                            ))}
                                        </ul>
                                    }
                                </>
                            ))
                            }
                        </div>
                    ))}
                </Space>
            </Space>
        </div>
    );
};

export default Business;