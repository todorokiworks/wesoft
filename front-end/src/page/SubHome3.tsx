import React from 'react';
import '../css/home.less'
import { getDataBaseUrl } from '../config';
import TweenOne from 'rc-tween-one';
import QueueAnim from 'rc-queue-anim';
import { Button } from 'antd';
import RcScrollOverPack from 'rc-scroll-anim/lib/ScrollOverPack';

const SubHome3: React.FC = () => {
    return (
        <RcScrollOverPack className='homepage'>
    <TweenOne
        key="image"
        className="img-wrapper"
        animation={{ x: 0, opacity: 1, ease: 'easeOutQuad' }}
        style={{ transform: 'translateX(-100px)', opacity: 0 }}
    >
        <img src={`${getDataBaseUrl()}/image/companybuild.png`} style={{height:'60vh'}} alt="会社概要" />
    </TweenOne>
    <QueueAnim
        type={'right'}
        className="text-wrapper"
        key="text"
        leaveReverse
    >
        <h2 key="h2">会社概要</h2>
        <p key="p" style={{ maxWidth: 310 }}>
            所在地や資本金など、当社の基本的な情報をご紹介します。 
        </p>
        <div key="button">
            <Button type="primary" style={{ backgroundColor: '#CC3300',  borderColor: '#CC3300' }} size="large">
            詳細はこちら
            </Button>

        </div>
        </QueueAnim>
        </RcScrollOverPack>
    );
};

export default SubHome3;