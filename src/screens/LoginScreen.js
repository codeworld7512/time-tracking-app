import * as React from "react";
import {
  Button,
  TextInput,
  Text,
  Checkbox,
  useTheme,
  HelperText,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { i18n } from "../i18n";
import { commonStyles } from "../styles";
import useSnackbar from "../context/userSnackbar";
import { login } from "../redux/actions/authActions";
import { storage } from "../utils/storage";
import { store } from "../redux/store";
import {
  LOGIN_FALIED,
  LOGIN_SUCCESS,
  SET_ROLES,
  SET_USERNAME,
} from "../redux/actionTypes";
import { apis } from "../apis";

export default function LoginScreen() {
  const { dispatch: showSnackbar } = useSnackbar();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      code: "",
    },
  });
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPass, setShowPass] = React.useState(false);

  const handleLogin = async (data) => {
    try {
      const {
        data: { access_token, roles, username },
      } = await apis.login(data);
      await storage.setItem("access_token", access_token);
      store.dispatch({ type: LOGIN_SUCCESS, payload: {} });
      store.dispatch({ type: SET_ROLES, payload: roles });
      store.dispatch({ type: SET_USERNAME, payload: username });
      showSnackbar({
        type: "open",
        message: i18n.t("youAreLoggedInSuccessfully"),
        snackbarType: "success",
      });
      await storage.setItem("remember_me", rememberMe);
      if (rememberMe) {
        await storage.setItem("username", data.username);
        await storage.setItem("password", data.password);
      } else {
        await storage.removeItem("username");
        await storage.removeItem("password");
      }
    } catch (error) {
      console.log(error);
      store.dispatch({ type: LOGIN_FALIED });
      showSnackbar({
        type: "open",
        message: i18n.t("somethingWentWrong"),
        snackbarType: "error",
      });
    }
  };

  React.useEffect(() => {
    const init = async () => {
      try {
        setValue("username", await storage.getItem("username"));
        setValue("password", await storage.getItem("password"));
        setRememberMe(await storage.getItem("remember_me"));
      } catch (error) {}
    };
    init();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={[commonStyles.container, styles.container]}>
          <View style={styles.logoContainer}>
            <Image source={require("../../assets/logo.png")} />
          </View>
          <Text variant="titleLarge" style={styles.title}>
            {i18n.t("welcomeToOurQuickReg")}
          </Text>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label={i18n.t("username")}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.username}
                style={commonStyles.mt20}
              />
            )}
            name="username"
          />
          <HelperText type="error" visible={!!errors.username}>
            {i18n.t("thisIsRequired")}
          </HelperText>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label={i18n.t("password")}
                secureTextEntry={!showPass}
                error={errors.password}
                right={
                  <TextInput.Icon
                    icon={!showPass ? "eye" : "eye-off"}
                    onPress={() => setShowPass(!showPass)}
                  />
                }
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="password"
          />
          <HelperText type="error" visible={!!errors.password}>
            {i18n.t("thisIsRequired")}
          </HelperText>
          <Pressable
            style={styles.checkboxContainer}
            onPress={() => {
              setRememberMe(!rememberMe);
            }}
          >
            <Checkbox status={rememberMe ? "checked" : "unchecked"} />
            <Text> {i18n.t("rememberMe")}</Text>
          </Pressable>
          <Button
            mode="contained"
            loading={isSubmitting}
            onPress={handleSubmit(handleLogin)}
            style={commonStyles.mt20}
            disabled={isSubmitting}
          >
            {i18n.t("login")}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
