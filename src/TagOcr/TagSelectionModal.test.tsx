// import { render, screen } from '@testing-library/react';
// import TagSelectionModal from './TagSelectionModal';
// import React from 'react';

// describe('<TagSelectionModal>', () => {
//     it('Shows a suggestion as a clickable button upon successful loading', () => {
//         render(
//             <TagSelectionModal
//                 suggestedTags={[{ id: '13', value: 'TestSuggestion' }]}
//                 ocrStatus={AsyncStatus.SUCCESS}
//                 setQuery={(): void => console.log('Set query')}
//                 setShowTagSelectionModal={(): void =>
//                     console.log('Set selection modal show')
//                 }
//                 setSuggestedTags={(): void => console.log('Set suggested tags')}
//             />
//         );
//         expect(
//             screen.getByRole('button', { name: 'TestSuggestion' })
//         ).toBeInTheDocument();
//     });
// });
export {};
