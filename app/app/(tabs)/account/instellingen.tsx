import { useRouter } from 'expo-router';
import { Groep, MenuRij, Scherm } from '@/components/account-ui';

export default function Instellingen() {
  const router = useRouter();
  return (
    <Scherm titel="Instellingen">
      <Groep>
        <MenuRij
          icoon="flag-outline"
          label="Locatie"
          extra="België"
          onPress={() => router.push('/account/instellingen-locatie')}
        />
        <MenuRij
          icoon="notifications-outline"
          label="Pushmeldingen"
          onPress={() => router.push('/account/instellingen-push')}
        />
        <MenuRij
          icoon="mail-outline"
          label="E-mailvoorkeuren"
          onPress={() => router.push('/account/instellingen-email')}
        />
        <MenuRij
          icoon="chatbox-outline"
          label="Sms-voorkeuren"
          onPress={() => router.push('/account/instellingen-sms')}
        />
        <MenuRij
          icoon="newspaper-outline"
          label="Postvoorkeuren"
          onPress={() => router.push('/account/instellingen-post')}
        />
      </Groep>
    </Scherm>
  );
}
