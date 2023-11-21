import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { i18n } from "../../i18n";
import HourRegistrationOverviewScreen from "../../screens/hourRegistration";
import CreateHourRegistrationNavigator from "./CreateHourRegistrationNavigator";
import HourRegDetailsScreen from "../../screens/hourRegistration/HourRegDetailsScreen";
import HourRegEditScreen from "../../screens/hourRegistration/HourRegEditScreen";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();

function HourRegistrationNavigator({ navigation }) {
  const {
    myConfig: {
      keys: { HoursShownewhourregistration },
    },
  } = useSelector((state) => state.common);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Overview"
        options={{ title: i18n.t("overview") }}
        component={HourRegistrationOverviewScreen}
      />
      <Stack.Screen
        name="Details"
        options={{ title: i18n.t("details") }}
        component={HourRegDetailsScreen}
      />
      {HoursShownewhourregistration && (
        <Stack.Screen
          name="Create"
          options={{ title: i18n.t("create") }}
          component={CreateHourRegistrationNavigator}
        />
      )}
      <Stack.Screen
        name="Edit"
        options={{ title: i18n.t("edit") }}
        component={HourRegEditScreen}
      />
    </Stack.Navigator>
  );
}

export default HourRegistrationNavigator;
