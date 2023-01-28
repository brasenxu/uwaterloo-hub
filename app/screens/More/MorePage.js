import React from "react";
import { Image, View } from "react-native";
import Divider from "../../components/Divider";
import MenuItem from "../../components/MenuItem";


function MorePage({ navigation }) {

    return (

        <View>

            <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Image source={require("../../assets/logos/white.png")} style={{ width: 120, height: 120 }} />
            </View>
            <Divider />

            <MenuItem
                title="UW Food Menu"
                icon="food-outline" onPress={() => navigation.navigate("Settings")}/>
            <MenuItem
                title="GRT Schedule"
                icon="bus-clock" onPress={() => navigation.navigate("Settings")}/>

            <Divider />

            <MenuItem
                title="Settings"
                icon="cog-outline" onPress={() => navigation.navigate("Settings")}/>
            <MenuItem
                title="About"
                icon="information-outline" onPress={() => navigation.navigate("Settings")}/>

        </View>

    );

}


export default MorePage;
