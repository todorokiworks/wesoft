import React from 'react';
import Banner from '../common/Banner';
import PageMeta from '../common/PageMeta';
import SubHome0 from './SubHome0';
import SubHome1 from './SubHome1';
import SubHome2 from './SubHome2';
import { PAGE_META } from '../seo/pageMeta';

const Home: React.FC = () => {

    return (
        <div className="home-root">
            <PageMeta {...PAGE_META["/"]} />
            <Banner />
            <SubHome0 />
            <SubHome1 />
            <SubHome2 />
        </div>
    );
};

export default Home;