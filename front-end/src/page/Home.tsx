import React from 'react';
import Banner from '../common/Banner';
import SubHome0 from './SubHome0';
import SubHome1 from './SubHome1';



const Home: React.FC = () => {

    return (
        <div>
            <Banner />
            <SubHome0 />
            <SubHome1 />
        </div>
    );
};

export default Home;