import React from 'react';
import styled from 'styled-components';
import { BaseBox } from '../shared';

const Container = styled(BaseBox)`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 35px 40px 10px 40px;
    margin-bottom: 10px;
    form {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
`;

const FormBox: React.FC = ({children}) => {
    return (
        <Container>
            {children}
        </Container>
    );
};

export default FormBox;