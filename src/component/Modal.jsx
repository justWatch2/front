import {useEffect, useState} from 'react';
import styled from 'styled-components';
import Years from "../data/Years.js";

export const ModalContainer = styled.div`
    // Modal을 구현하는데 전체적으로 필요한 CSS를 구현
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

export const ModalBackdrop = styled.div`
    // Modal이 떴을 때의 배경을 깔아주는 CSS를 구현
    z-index: 3; //위치지정 요소
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;

export const ModalBtn = styled.button`
    background-color: #7e5bef;
    text-decoration: none;
    border: 1px solid rgb(150, 150, 150);
    padding: 20px;
    color: white;
    cursor: grab;
`;

export const SelectTag = styled.span`
    width: auto;
    height: 32px;
    display: inline-block;
    align-items: center;
    justify-content: center;
    color: white;
    padding: 0 8px;
    font-size: 14px;
    list-style: none;
    border-radius: 6px;
    margin: 0 8px 8px 0;
    background: #4000c7;
`;

export const Tag = styled.span`
    width: auto;
    height: 32px;
    display: inline-block;
    align-items: center;
    justify-content: center;
    color: white;
    padding: 0 8px;
    font-size: 14px;
    list-style: none;
    border-radius: 6px;
    margin: 0 8px 8px 0;
    background: #111111;
`;

export const ExitBtn = styled(ModalBtn)`
    background-color: #4000c7;
    border-radius: 10px;
    text-decoration: none;
    margin: 10px;
    padding: 5px 10px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ModalView = styled.div.attrs((props) => ({
    // attrs 메소드를 이용해서 아래와 같이 div 엘리먼트에 속성을 추가할 수 있다.
    role: 'dialog',
}))`
    // Modal창 CSS를 구현합니다.
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 20px;
    width: 500px;
    color: white;

    background-color: rgb(50, 50, 50);

    > div.desc {
        font-size: 20px;
        color: #7e5bef;
        margin: 20px 50px 0;
    }
`;

export const Modal = ({filterState, setFilterState}) => {
    const [isOpen, setIsOpen] = useState(false);
    const {genres, adult, years, korea} = filterState;

    const openModalHandler = () => {
        setIsOpen(prev => !prev);
    };

    const tagClickALL = (e) => {
        // const nextGenres = genres.slice();
        // let Flag=nextGenres.some((genre)=>!genre.select)
        //
        // for(let i = 0; i < nextGenres.length; i++){
        //     nextGenres[i].select = Flag;
        // }
        // setFilterState(prev=>({...prev, genres:nextGenres}));
        // e.target.innerHTML=Flag ? "전체해제":"전체선택"
        const nextGenres = genres.map(genre => ({
            ...genre,
            select: genres.some(g => !g.select),
        }));
        setFilterState(prev => ({...prev, genres: nextGenres}));
        e.target.innerHTML = genres.some(g => !g.select) ? '전체해제' : '전체선택';
    }


    const tagClickList = (e) => {
        const name = e.target.getAttribute("name");
        const next = [...filterState[name]];
        next[e.target.id].select = !next[e.target.id].select;
        setFilterState(prev => ({...prev, [name]: next}));
    }

    const tagClick = ((e) => {
        const name = e.target.getAttribute("name");
        setFilterState(prev => ({...prev, [name]: !prev[name]}));
    });

    return (
        <>
            <ModalContainer>
                <ModalBtn onClick={openModalHandler} className="form-select-sm bg-dark text-light group"
                    // 클릭하면 Modal이 열린 상태(isOpen)를 boolean 타입으로 변경하는 메소드가 실행되어야 합니다.
                > 상세검색
                    {/* 조건부 렌더링을 활용해서 Modal이 열린 상태(isOpen이 true인 상태)일 때는 ModalBtn의 내부 텍스트가 'Opened!' 로 Modal이 닫힌 상태(isOpen이 false인 상태)일 때는 ModalBtn 의 내부 텍스트가 'Open Modal'이 되도록 구현 */}
                </ModalBtn>
                {/* 조건부 렌더링을 활용해서 Modal이 열린 상태(isOpen이 true인 상태)일 때만 모달창과 배경이 뜰 수 있게 구현 */}
                {isOpen ?
                    <ModalBackdrop onClick={openModalHandler}>
                        <ModalView onClick={(e) => e.stopPropagation()}>
                            <br/>
                            <h2>검색필터</h2>
                            <div className='desc'>
                                {adult ? <SelectTag name={"adult"} onClick={tagClick}>
                                        성인 포함
                                    </SelectTag> :
                                    <Tag name={"adult"} onClick={tagClick}>
                                        성인 미포함
                                    </Tag>}
                                {korea ? <SelectTag name={"korea"} onClick={tagClick}>
                                        국내영화
                                    </SelectTag> :
                                    <Tag name={"korea"} onClick={tagClick}>
                                        해외포함
                                    </Tag>}
                            </div>
                            <div className='desc'>
                                {Years?.map((item, index) => (
                                    item.select ?
                                        <SelectTag
                                            key={index} id={index} name={"years"}
                                            onClick={tagClickList}>
                                            {item.name}
                                        </SelectTag> : <Tag
                                            key={index} id={index} name={"years"}
                                            onClick={tagClickList}>
                                            {item.name}
                                        </Tag>
                                ))}
                            </div>
                            <div className='desc'>
                                <SelectTag
                                    onClick={tagClickALL}>
                                    전체해제
                                </SelectTag>
                                {genres?.map((item, index) => (
                                    item.select ?
                                        <SelectTag
                                            key={index} id={index} name={"genres"}
                                            onClick={tagClickList}>
                                            {item.name}
                                        </SelectTag> : <Tag
                                            key={index} id={index} name={"genres"}
                                            onClick={tagClickList}>
                                            {item.name}
                                        </Tag>
                                ))}
                            </div>
                            <ExitBtn onClick={openModalHandler}>x</ExitBtn>
                        </ModalView>
                    </ModalBackdrop>
                    : null
                }
            </ModalContainer>
        </>
    );
};