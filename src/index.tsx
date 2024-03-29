//Modules
import Checklist from './modules/Checklist/Checklist';
import TempAttachments from './modules/Attachments/TempAttachments';
import Attachments from './modules/Attachments/Attachments';
import TagPhotoRecognition from './modules/TagOcr/TagPhotoRecognition';
import NewPunch from './modules/PunchPages/NewPunch';
import ClearPunch from './modules/PunchPages/ClearPunch';
import VerifyPunch from './modules/PunchPages/VerifyPunch';
import ChecklistV2 from './modules/Checklist copy/ChecklistV2';

//Components
import AsyncCard from './components/AsyncCard';
import CollapsibleCard from './components/CollapsibleCard';
import InfoItem from './components/InfoItem/InfoItem';
import StatusColumn from './components/InfoItem/StatusColumn';
import ErrorPage from './components/error/ErrorPage';
import HomeButton from './components/buttons/HomeButton';
import ReloadButton from './components/buttons/ReloadButton';
import BackButton from './components/buttons/BackButton';
import ProcosysButton from './components/buttons/ProcosysButton';
import Navbar from './components/NavBar';
import LoadingPage from './components/loading/LoadingPage';
import SkeletonLoadingPage from './components/loading/SkeletonLoader';
import EntityDetails from './components/EntityDetails/EntityDetails';
import TextIcon from './components/EntityDetails/TextIcon';
import PunchList from './components/PunchList';
import Scope from './components/Scope';
import FooterButton from './components/Footer/FooterButton';
import NavigationFooter from './components/Footer/NavigationFooter';
import SearchTypeButton from './components/buttons/SearchTypeButton';
import PageHeader from './components/PageHeader';
import TagInfo from './components/TagInfo/TagInfo';
import AttachmentsFromList from './modules/Attachments/AttachmentsFromList';
import DocumentFilter from './components/Filter/DocumentFilter/DocumentFilter';

//types and enums
import {
    StorageKey,
    AsyncStatus,
    CompletionStatus,
    PunchAction,
    SearchStatus,
    DocumentRelationType,
    SearchType,
} from './typings/enums';
import {
    Project,
    Plant,
    Attachment,
    Document,
    DocumentAttachment,
    ChecklistDetails,
    ChecklistResponse,
    ItemToMultiSignOrVerify,
    CheckItem,
    APIComment,
    PunchPriority,
    PunchComment,
} from './typings/apiTypes';
import {
    ChosenPerson,
    PunchFormData,
    PunchEndpoints,
    UpdatePunchData,
    SearchResult,
    SearchState,
    IEntity,
    FetchOperationProps,
    ProcosysApiSettings,
} from './typings/helperTypes';
import ChecklistV2Api from './modules/Checklist copy/checklistV2Api';

//Utils
import ensure from './utils/ensure';
import removeSubdirectories from './utils/removeSubdirectories';
import matchPlantInURL from './utils/matchPlantInURL';
import matchProjectInURL from './utils/matchProjectInURL';
import objectToCamelCase from './utils/objectToCamelCase';
import useFormFields from './utils/useFormFields';
import useSnackbar from './utils/useSnackbar';
import { isOfType, isArrayOfType } from './utils/typeguard';
import { removeHtmlFromText } from './utils/removeHtmlFromText';
import {
    removeBaseUrlFromUrl,
    updateOfflineEntityObj,
    getErrorMessage,
    getAttachmentByFetch,
    getByFetch,
    postByFetch,
    putByFetch,
    deleteByFetch,
} from './services/apiHelpers';
import { HTTPError } from './services/HTTPError';

export {
    ChecklistV2,
    NewPunch,
    ClearPunch,
    VerifyPunch,
    removeHtmlFromText,
    isArrayOfType,
    isOfType,
    ensure,
    matchPlantInURL,
    matchProjectInURL,
    objectToCamelCase,
    useFormFields,
    useSnackbar,
    Checklist,
    AsyncCard,
    TempAttachments,
    Attachments,
    CollapsibleCard,
    InfoItem,
    StatusColumn,
    ErrorPage,
    HomeButton,
    ReloadButton,
    Navbar,
    BackButton,
    ProcosysButton,
    LoadingPage,
    SkeletonLoadingPage,
    removeSubdirectories,
    PunchList,
    Scope,
    FooterButton,
    NavigationFooter,
    EntityDetails,
    TextIcon,
    SearchTypeButton,
    PageHeader,
    TagPhotoRecognition,
    TagInfo,
    AttachmentsFromList,
    DocumentFilter,
    removeBaseUrlFromUrl,
    updateOfflineEntityObj,
    getErrorMessage,
    getAttachmentByFetch,
    getByFetch,
    postByFetch,
    putByFetch,
    deleteByFetch,
    HTTPError,
    AsyncStatus,
    StorageKey,
    CompletionStatus,
    PunchAction,
    SearchStatus,
    DocumentRelationType,
    SearchType,
};

export type {
    Project,
    Plant,
    Attachment,
    ChosenPerson,
    PunchFormData,
    PunchEndpoints,
    UpdatePunchData,
    SearchResult,
    SearchState,
    Document,
    DocumentAttachment,
    IEntity,
    FetchOperationProps,
    ProcosysApiSettings,
    ChecklistDetails,
    ChecklistResponse,
    ItemToMultiSignOrVerify,
    CheckItem,
    APIComment,
    PunchPriority,
    PunchComment,
    ChecklistV2Api,
};
