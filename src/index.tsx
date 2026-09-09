//Modules
import Attachments from './modules/Attachments/Attachments';
import TempAttachments from './modules/Attachments/TempAttachments';
import ChecklistV2 from './modules/Checklist copy/ChecklistV2';
import Checklist from './modules/Checklist/Checklist';
import ClearPunch from './modules/PunchPages/ClearPunch';
import NewPunch from './modules/PunchPages/NewPunch';
import VerifyPunch from './modules/PunchPages/VerifyPunch';

//Components
import AsyncCard from './components/AsyncCard';
import BackButton from './components/buttons/BackButton';
import HomeButton from './components/buttons/HomeButton';
import ProcosysButton from './components/buttons/ProcosysButton';
import ReloadButton from './components/buttons/ReloadButton';
import SearchTypeButton from './components/buttons/SearchTypeButton';
import CollapsibleCard from './components/CollapsibleCard';
import EntityDetails from './components/EntityDetails/EntityDetails';
import TextIcon from './components/EntityDetails/TextIcon';
import ErrorPage from './components/error/ErrorPage';
import DocumentFilter from './components/Filter/DocumentFilter/DocumentFilter';
import FooterButton from './components/Footer/FooterButton';
import NavigationFooter from './components/Footer/NavigationFooter';
import InfoItem from './components/InfoItem/InfoItem';
import StatusColumn from './components/InfoItem/StatusColumn';
import LoadingPage from './components/loading/LoadingPage';
import SkeletonLoadingPage from './components/loading/SkeletonLoader';
import Navbar from './components/NavBar';
import PageHeader from './components/PageHeader';
import PunchList from './components/PunchList';
import Scope from './components/Scope';
import TagInfo from './components/TagInfo/TagInfo';
import AttachmentsFromList from './modules/Attachments/AttachmentsFromList';

//types and enums
import ChecklistV2Api from './modules/Checklist copy/checklistV2Api';
import {
    APIComment,
    Attachment,
    CheckItem,
    ChecklistDetails,
    ChecklistResponse,
    Document,
    DocumentAttachment,
    ItemToMultiSignOrVerify,
    Plant,
    Project,
    PunchComment,
    PunchPriority,
} from './typings/apiTypes';
import {
    AsyncStatus,
    CompletionStatus,
    DocumentRelationType,
    PunchAction,
    SearchStatus,
    SearchType,
    StorageKey,
} from './typings/enums';
import {
    ChosenPerson,
    FetchOperationProps,
    IEntity,
    ProcosysApiSettings,
    PunchEndpoints,
    PunchFormData,
    SearchResult,
    SearchState,
    UpdatePunchData,
} from './typings/helperTypes';

//Utils
import {
    deleteByFetch,
    getAttachmentByFetch,
    getByFetch,
    getErrorMessage,
    postByFetch,
    putByFetch,
    removeBaseUrlFromUrl,
    updateOfflineEntityObj,
} from './services/apiHelpers';
import { HTTPError } from './services/HTTPError';
import ensure from './utils/ensure';
import matchPlantInURL from './utils/matchPlantInURL';
import matchProjectInURL from './utils/matchProjectInURL';
import objectToCamelCase from './utils/objectToCamelCase';
import { removeHtmlFromText } from './utils/removeHtmlFromText';
import removeSubdirectories from './utils/removeSubdirectories';
import { isArrayOfType, isOfType } from './utils/typeguard';
import useFormFields from './utils/useFormFields';
import useSnackbar from './utils/useSnackbar';

export {
    AsyncCard,
    AsyncStatus,
    Attachments,
    AttachmentsFromList,
    BackButton,
    Checklist,
    ChecklistV2,
    ClearPunch,
    CollapsibleCard,
    CompletionStatus,
    deleteByFetch,
    DocumentFilter,
    DocumentRelationType,
    ensure,
    EntityDetails,
    ErrorPage,
    FooterButton,
    getAttachmentByFetch,
    getByFetch,
    getErrorMessage,
    HomeButton,
    HTTPError,
    InfoItem,
    isArrayOfType,
    isOfType,
    LoadingPage,
    matchPlantInURL,
    matchProjectInURL,
    Navbar,
    NavigationFooter,
    NewPunch,
    objectToCamelCase,
    PageHeader,
    postByFetch,
    ProcosysButton,
    PunchAction,
    PunchList,
    putByFetch,
    ReloadButton,
    removeBaseUrlFromUrl,
    removeHtmlFromText,
    removeSubdirectories,
    Scope,
    SearchStatus,
    SearchType,
    SearchTypeButton,
    SkeletonLoadingPage,
    StatusColumn,
    StorageKey,
    TagInfo,
    TempAttachments,
    TextIcon,
    updateOfflineEntityObj,
    useFormFields,
    useSnackbar,
    VerifyPunch
};

    export type {
        APIComment,
        Attachment,
        CheckItem,
        ChecklistDetails,
        ChecklistResponse,
        ChecklistV2Api,
        ChosenPerson,
        Document,
        DocumentAttachment,
        FetchOperationProps,
        IEntity,
        ItemToMultiSignOrVerify,
        Plant,
        ProcosysApiSettings,
        Project,
        PunchComment,
        PunchEndpoints,
        PunchFormData,
        PunchPriority,
        SearchResult,
        SearchState,
        UpdatePunchData
    };

