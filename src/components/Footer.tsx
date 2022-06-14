import {
    Dispatch,
    SetStateAction,
    useEffect,
    useState
} from 'react';
import { RelayingServices, SmartWallet } from 'relaying-services-sdk';
import { SmartWalletWithBalance } from 'src/types';
import Utils, { TRIF_PRICE } from 'src/Utils';
import 'src/components/Footer.css';
import { Col, Row, Button, Icon } from 'react-materialize';

type FooterProps = {
    smartWallets: SmartWalletWithBalance[];
    setSmartWallets: Dispatch<SetStateAction<SmartWalletWithBalance[]>>;
    connected: boolean;
    account?: string;
    provider?: RelayingServices;
    setShow: Dispatch<SetStateAction<boolean>>;
};

function Footer(props: FooterProps) {
    const {
        smartWallets,
        setSmartWallets,
        connected,
        account,
        provider,
        setShow
    } = props;

    const [workerBalance, setWorkerBalance] = useState('0');

    const setBalance = async (smartWallet: SmartWallet, deployed: boolean): Promise<SmartWalletWithBalance> => {
        const balance = await Utils.tokenBalance(smartWallet.address);
        const rbtcBalance = await Utils.getBalance(smartWallet.address);
        const swWithBalance = {
            ...smartWallet,
            balance: `${Utils.fromWei(balance)} tRIF`,
            rbtcBalance: `${Utils.fromWei(rbtcBalance)} RBTC`,
            deployed
        };
        return swWithBalance;
    }

    useEffect(() => {
        if (!account || !provider) {
            return;
        }
        (async () => {
            let index: number = 0;
            let found: boolean = true;
            while (found) {
                // eslint-disable-next-line no-await-in-loop
                const smartWalletAddress = await provider.generateSmartWallet(index + 1);
                // eslint-disable-next-line no-await-in-loop
                const deployed = await provider.isSmartWalletDeployed(smartWalletAddress.address);
                if (deployed) {
                    // eslint-disable-next-line no-await-in-loop
                    const smartWalletWithBalance = await setBalance(
                        smartWalletAddress,
                        deployed
                    );
                    setSmartWallets((currentSmartWallet) => [
                        ...currentSmartWallet,
                        smartWalletWithBalance
                    ]);
                    index += 1;
                }else{
                    found = false;
                }
            }
        })();
    }, [account]);

    useEffect(() => {
        (async () => {
            const workerAddress = process.env.REACT_APP_CONTRACTS_RELAY_WORKER!;
            const currentWorkerBalance = parseFloat(
                Utils.fromWei(await Utils.tokenBalance(workerAddress))
            ).toFixed(4);
            setWorkerBalance(currentWorkerBalance);
        })();
    }, [setWorkerBalance]);

    const create = async () => {
        if (provider) {
            setShow(true);
            const smartWallet = await provider?.generateSmartWallet(smartWallets.length + 1);
            const smartWalletWithBalance = await setBalance(smartWallet, false);
            setSmartWallets([...smartWallets, smartWalletWithBalance]);
            setShow(false);
        }
    }

    return (
        <Row className='space-row'>
            <Col s={6}>
                <Button
                    waves='light'
                    className='indigo accent-2'
                    onClick={create}
                    disabled={!connected}
                >
                    New Smart Wallet
                    <Icon right>
                        add_circle_outline
                    </Icon>
                </Button>
            </Col>
            <Col s={6}>
                <Row>
                    <Col s={6}>
                        <h6>
                            tRIF price:
                            {' '}
                            <span id='trif-price'>{TRIF_PRICE}</span>
                            {' '}
                            RBTC
                        </h6>
                    </Col>
                    <Col s={6}>
                        <h6>
                            Worker balance:
                            {' '}
                            <span id='worker-balance'>
                                {workerBalance}
                            </span>
                            {' '}
                            tRIF
                        </h6>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}

export default Footer;
