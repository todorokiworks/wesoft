import React from 'react';
import { Skeleton } from 'antd';

const SkeletonView: React.FC = () => {
    return (
        <div style={{ height: '100vh' }}>
            <Skeleton title round active />
            <Skeleton round active />
            <Skeleton loading paragraph active />
        </div>
    );
};

export default SkeletonView;