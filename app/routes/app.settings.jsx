import { Form, json, useLoaderData } from "@remix-run/react";
import {
  Page,
  BlockStack,
  InlineGrid,
  Text,
  Box,
  TextField,
  Card,
  Button,
} from "@shopify/polaris";
import { useState } from "react";
import prisma from "../db.server";
import { authenticate } from "../shopify.server";
export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  let settings = await prisma.settings.findFirst({
    where: {
      shop: session.shop,
    },
  });
  if (!settings) {
    settings = {};
  }

  // provides data to the component
  return json(settings);
}

export async function action({ request }) {
  // updates persistent data
  let settings = await request.formData();

  settings = Object.fromEntries(settings);
  const { session } = await authenticate.admin(request);

  // Database Update ....

  await prisma.settings.upsert({
    where: { shop: session.shop },
    update: {
      title: settings.title,
      description: settings.description,
      shop: session.shop,
    },
    create: {
      title: settings.title,
      description: settings.description,
      shop: session.shop,
    },
  });

  return json(settings);
}
function Settings() {
  const settings = useLoaderData();
  const [formState, setFormState] = useState(settings);
  //   console.log(settings);
  return (
    <Page divider>
      <ui-title-bar title="Settings"></ui-title-bar>
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Title
              </Text>
              <Text as="p" variant="bodyMd">
                Description
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Form method="POST">
                <TextField
                  label="Title"
                  name="title"
                  value={formState?.title}
                  onChange={(value) =>
                    setFormState({ ...formState, title: value })
                  }
                />
                <TextField
                  label="Description"
                  name="description"
                  value={formState?.description}
                  onChange={(value) =>
                    setFormState({ ...formState, description: value })
                  }
                />
                <Button submit={true}>Save Data</Button>
              </Form>
            </BlockStack>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}

export default Settings;
