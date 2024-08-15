import styled from 'styled-components';

interface PageHeaderWrapperProps {
    $hasSubtitle: boolean;
}
const PageHeaderWrapper = styled.div<PageHeaderWrapperProps>`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
    & h2 {
        text-align: center;
        margin: ${(props): string =>
            props.$hasSubtitle ? '16px 0 0 0' : '16px 0 24px 0'};
    }
    & h6 {
        text-align: center;
        margin: 0 0 5px 0;
        margin-bottom: 32px;
        max-width: 80vw;
    }
`;
type PageHeaderProps = {
    title: string;
    subtitle?: string;
};
const PageHeader = ({ title, subtitle }: PageHeaderProps): JSX.Element => {
    const hasSubtitle = Boolean(subtitle);
    return (
        <PageHeaderWrapper $hasSubtitle={hasSubtitle}>
            <h2>{title}</h2>
            {hasSubtitle && <h6>{subtitle}</h6>}
        </PageHeaderWrapper>
    );
};

export default PageHeader;
